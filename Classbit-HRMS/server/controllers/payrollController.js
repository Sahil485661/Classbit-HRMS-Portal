const { PayrollRecord, SalaryComponent, Employee, Attendance, Loan, ReimbursementClaim, ReimbursementCategory } = require('../models');
const { Op } = require('sequelize');

// ─────────────────────────────────────────────────
// HELPER: Dynamic Statutory Compliance equations
// ─────────────────────────────────────────────────
const calcCompliance = (baseSalary, grossSalary, config) => {
    const base = parseFloat(baseSalary) || 0;
    const gross = parseFloat(grossSalary) || 0;

    let pfEmployee = 0, pfEmployer = 0, esiEmployee = 0, professionalTax = 0, tds = 0;

    // PF: Dynamic % of Basic (capped dynamically)
    if (config?.pf?.enabled) {
        const pfBasis = config.pf.basicCap > 0 ? Math.min(base, config.pf.basicCap) : base;
        pfEmployee = Math.round(pfBasis * (config.pf.employeePercent / 100));
        pfEmployer = Math.round(pfBasis * (config.pf.employerPercent / 100));
    }

    // ESI: Dynamic % of Gross if gross <= Dynamic Threshold
    if (config?.esi?.enabled && gross <= config.esi.maxGross) {
        esiEmployee = Math.round(gross * (config.esi.employeePercent / 100));
    }

    // Professional Tax: Dynamic slab-based mapping against Gross Salary
    if (config?.pt?.enabled && Array.isArray(config.pt.slabs)) {
        const slab = config.pt.slabs.find(s => gross >= s.min && gross <= s.max);
        if (slab) professionalTax = parseFloat(slab.deduction);
    }
    
    // TDS: Dynamic % if Gross > Dynamic Threshold
    if (config?.tds?.enabled && gross > config.tds.monthlyThreshold) {
        tds = Math.round(gross * (config.tds.percent / 100));
    }

    return { pfEmployee, pfEmployer, esiEmployee, professionalTax, tds };
};

// ─────────────────────────────────────────────────
// GENERATE PAYROLL (HR Role)
// ─────────────────────────────────────────────────
const generatePayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        const paddedMonth = String(month).padStart(2, '0');

        const employees = await Employee.findAll({
            where: { status: 'Active' },
            include: [SalaryComponent]
        });
        
        // Fetch compliance settings globally for this batch
        const { Setting } = require('../models');
        let complianceConfig = null;
        try {
            const setting = await Setting.findOne({ where: { key: 'statutory_compliance' } });
            if (setting && setting.value) {
                complianceConfig = typeof setting.value === 'string' ? JSON.parse(setting.value) : setting.value;
            }
        } catch (e) { console.error('Failed to load compliance config', e); }
        
        if (!complianceConfig) {
            complianceConfig = {
                pf: { enabled: true, employeePercent: 12, employerPercent: 12, basicCap: 15000 },
                esi: { enabled: true, employeePercent: 0.75, employerPercent: 3.25, maxGross: 21000 },
                tds: { enabled: true, percent: 10, monthlyThreshold: 50000 },
                pt: {
                    enabled: true,
                    slabs: [
                        { min: 0, max: 7500, deduction: 0 },
                        { min: 7501, max: 10000, deduction: 75 },
                        { min: 10001, max: 20000, deduction: 150 },
                        { min: 20001, max: 999999999, deduction: 200 }
                    ]
                }
            };
        }

        const results = [];

        for (const emp of employees) {
            if (!emp.SalaryComponent) continue;

            let { baseSalary, allowances = {}, deductions: customDeductions = {} } = emp.SalaryComponent;
            if (typeof allowances === 'string') allowances = JSON.parse(allowances);
            if (typeof customDeductions === 'string') customDeductions = JSON.parse(customDeductions);
            const base = parseFloat(baseSalary) || 0;

            // ── 1. Attendance & LOP ──
            const workingDaysInMonth = new Date(year, month, 0).getDate();
            
            const absentDays = await Attendance.count({
                where: {
                    employeeId: emp.id,
                    date: { [Op.between]: [`${year}-${paddedMonth}-01`, `${year}-${paddedMonth}-${workingDaysInMonth}`] },
                    status: 'Absent'
                }
            });
            const halfDays = await Attendance.count({
                where: {
                    employeeId: emp.id,
                    date: { [Op.between]: [`${year}-${paddedMonth}-01`, `${year}-${paddedMonth}-${workingDaysInMonth}`] },
                    status: 'Half Day'
                }
            });

            const lopDays = absentDays + (halfDays * 0.5);
            const perDaySalary = base / workingDaysInMonth;
            const lopAmount = Math.round(lopDays * perDaySalary);

            // ── 2. Effective base after LOP ──
            const effectiveBase = Math.max(0, base - lopAmount);

            // ── 2.5 Integrated Reimbursements ──
            const verifiedReimbursements = await ReimbursementClaim.findAll({
                where: {
                    employeeId: emp.id,
                    status: 'Finance_Verified'
                },
                include: [{ model: ReimbursementCategory, attributes: ['name'] }]
            });
            
            let reimbursementIds = [];
            verifiedReimbursements.forEach(claim => {
                const amount = parseFloat(claim.amount);
                const catName = claim.ReimbursementCategory?.name || 'Reimbursement';
                allowances[`${catName} (Claim)`] = (allowances[`${catName} (Claim)`] || 0) + amount;
                reimbursementIds.push(claim.id);
            });

            // ── 3. Total Allowances ──
            const allowanceTotal = Object.values(allowances).reduce((sum, v) => sum + parseFloat(v || 0), 0);

            // ── 4. Gross Salary ──
            const grossSalary = effectiveBase + allowanceTotal;

            // ── 5. Statutory Deductions ──
            const { pfEmployee, pfEmployer, esiEmployee, professionalTax, tds } = calcCompliance(effectiveBase, grossSalary, complianceConfig);

            // ── 6. Custom Deductions (from SalaryComponent) ──
            const customDedTotal = Object.values(customDeductions).reduce((sum, v) => sum + parseFloat(v || 0), 0);

            // ── 7. Active Loan Recovery ──
            const activeLoan = await Loan.findOne({
                where: {
                    employeeId: emp.id,
                    status: 'Approved',
                    remainingAmount: { [Op.gt]: 0 }
                },
                order: [['createdAt', 'ASC']]
            });
            const loanDeduction = activeLoan ? Math.min(parseFloat(activeLoan.monthlyInstallment), parseFloat(activeLoan.remainingAmount)) : 0;

            // ── 8. Total Deductions & Net ──
            const totalDeductions = pfEmployee + esiEmployee + professionalTax + tds + customDedTotal + loanDeduction;
            const netSalary = Math.max(0, grossSalary - totalDeductions);

            // ── 9. Breakdown Snapshot ──
            const breakdown = {
                baseSalary: base,
                effectiveBase,
                lopDays,
                lopAmount,
                allowances,
                allowanceTotal,
                grossSalary,
                deductions: {
                    pfEmployee,
                    pfEmployer,
                    esiEmployee,
                    professionalTax,
                    tds,
                    ...customDeductions,
                    loanRecovery: loanDeduction
                },
                totalDeductions,
                netSalary,
                loanId: activeLoan?.id || null,
                reimbursementIds
            };

            const existingRecord = await PayrollRecord.findOne({
                where: { employeeId: emp.id, month, year }
            });

            if (existingRecord) {
                if (existingRecord.status !== 'Draft') {
                    // CRITICAL INTEGRITY FIX: Do not overwrite if it is Verified, Approved, or Paid
                    continue;
                }
                await existingRecord.update({ grossSalary, totalDeductions, netSalary, breakdown });
                results.push(existingRecord);
            } else {
                const newRecord = await PayrollRecord.create({
                    employeeId: emp.id, month, year,
                    grossSalary, totalDeductions, netSalary, status: 'Draft', breakdown
                });
                results.push(newRecord);
            }
        }

        res.json({ message: `Payroll drafted for ${results.length} employees`, records: results });
    } catch (error) {
        console.error('generatePayroll error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────
// UPDATE PAYROLL STATUS (Finance → Verify, Manager → Approve/Pay)
// ─────────────────────────────────────────────────
const updatePayrollStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body; // 'verify' | 'approve' | 'pay'
        const role = req.user?.role;

        const record = await PayrollRecord.findByPk(id);
        if (!record) return res.status(404).json({ message: 'Payroll record not found' });

        const TRANSITIONS = {
            verify:  { from: 'Draft',     to: 'Verified', roles: ['Finance', 'HR', 'Super Admin'] },
            approve: { from: 'Verified',  to: 'Approved', roles: ['Manager', 'Super Admin'] },
            pay:     { from: 'Approved',  to: 'Paid',     roles: ['Manager', 'Super Admin', 'Finance'] }
        };

        const transition = TRANSITIONS[action];
        if (!transition) return res.status(400).json({ message: 'Invalid action' });
        if (!transition.roles.includes(role)) return res.status(403).json({ message: `Role '${role}' cannot perform '${action}'` });
        if (record.status !== transition.from) return res.status(400).json({ message: `Record must be '${transition.from}' to perform '${action}'` });

        await record.update({ status: transition.to, approvedBy: req.user?.email });

        // When marking Paid: deduct from active loan
        if (action === 'pay') {
            // Defensive JSON parse for MySQL where JSON columns can sometimes be strings
            const breakdownData = typeof record.breakdown === 'string' ? JSON.parse(record.breakdown) : (record.breakdown || {});
            const loanId = breakdownData?.loanId;
            if (loanId) {
                const loan = await Loan.findByPk(loanId);
                if (loan) {
                    const loanDeduction = parseFloat(breakdownData?.deductions?.loanRecovery || 0);
                    const newRemaining = Math.max(0, parseFloat(loan.remainingAmount) - loanDeduction);
                    await loan.update({
                        remainingAmount: newRemaining,
                        status: newRemaining === 0 ? 'Completed' : 'Approved'
                    });
                }
            }
            
            // Mark Reimbursements as Paid
            const rIds = breakdownData?.reimbursementIds || [];
            if (rIds.length > 0) {
                await ReimbursementClaim.update(
                    { status: 'Paid' },
                    { where: { id: { [Op.in]: rIds } } }
                );
            }
        }

        res.json({ message: `Payroll ${transition.to} successfully`, record });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────
// EXPORT BANK FILE (CSV for Approved records)
// ─────────────────────────────────────────────────
const exportBankFile = async (req, res) => {
    try {
        const { month, year } = req.query;
        const records = await PayrollRecord.findAll({
            where: { month, year, status: { [Op.in]: ['Approved', 'Paid'] } },
            include: [{ model: Employee }]
        });

        const rows = [['Account Holder Name', 'Bank Account Number', 'IFSC Code', 'Net Salary (INR)', 'Remark']];
        records.forEach(r => {
            const emp = r.Employee;
            rows.push([
                emp?.accountHolderName || `${emp?.firstName} ${emp?.lastName}`,
                emp?.bankAccountNumber || '',
                emp?.bankIfscCode || '',
                Number(r.netSalary).toFixed(2),
                `Salary ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`
            ]);
        });

        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="bank_transfer_${month}_${year}.csv"`);
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────
// GET PAYSLIPS
// ─────────────────────────────────────────────────
const getMyPayslips = async (req, res) => {
    try {
        const { employeeId } = req.user;
        const records = await PayrollRecord.findAll({
            where: { employeeId },
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllPayslips = async (req, res) => {
    try {
        const { month, year, status } = req.query;
        const where = {};
        if (month) where.month = month;
        if (year) where.year = year;
        if (status) where.status = status;

        const records = await PayrollRecord.findAll({
            where,
            include: [{ model: Employee }],
            order: [['year', 'DESC'], ['month', 'DESC']]
        });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Kept for backward compatibility
const lockPayroll = async (req, res) => {
    try {
        const { month, year } = req.body;
        await PayrollRecord.update({ status: 'Approved' }, { where: { month, year } });
        res.json({ message: 'Payroll approved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    generatePayroll,
    updatePayrollStatus,
    exportBankFile,
    getMyPayslips,
    getAllPayslips,
    lockPayroll
};
