import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    CreditCard, Download, Lock, CheckCircle2,
    AlertCircle, Filter, Wand2, Search
} from 'lucide-react';
import Modal from '../../components/Modal';

const PayrollPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
    const [genData, setGenData] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear() });

    const isAdmin = user?.role === 'Super Admin' || user?.role === 'HR';

    const fetchPayslips = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = isAdmin ? 'http://localhost:5000/api/payroll/all' : 'http://localhost:5000/api/payroll/my';
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPayslips(res.data);
        } catch (error) {
            console.error('Error fetching payslips:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayslips();
    }, [isAdmin]);

    const handleGenerate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/payroll/generate', genData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsGenerateModalOpen(false);
            fetchPayslips();
        } catch (error) {
            alert(error.response?.data?.message || 'Payroll generation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDisburse = async () => {
        if (!window.confirm('Are you sure you want to disburse all pending salaries for this period? This will record financial transactions.')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/payroll/disburse', genData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
            fetchPayslips();
        } catch (error) {
            alert(error.response?.data?.message || 'Disbursement failed');
        } finally {
            setLoading(false);
        }
    };

    const downloadPayslip = async (id, name, month, year) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/payroll/download/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Payslip_${name}_${month}_${year}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Failed to download payslip');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Financial Ledger</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {isAdmin ? 'Manage organization-wide payroll and disbursements.' : 'View and download your monthly salary statements.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    {isAdmin && (
                        <>
                            <button
                                onClick={() => setIsGenerateModalOpen(true)}
                                className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] px-5 py-2.5 rounded-xl font-bold transition-all border border-[var(--border-color)]"
                            >
                                <Wand2 className="w-4 h-4" />
                                Review Cycle
                            </button>
                            <button
                                onClick={handleDisburse}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"
                            >
                                <CreditCard className="w-4 h-4" />
                                Disburse Funds
                            </button>
                        </>
                    )}
                    <button className="flex items-center gap-2 bg-[var(--card-bg)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] px-4 py-2 rounded-xl text-sm font-medium transition-all border border-[var(--border-color)]">
                        <Filter className="w-4 h-4" />
                        Archive
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-600 to-blue-800 p-6 rounded-2xl text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                    <div className="relative z-10 text-left">
                        <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Aggregate Net (Current Month)</p>
                        <h2 className="text-4xl font-bold mt-2">
                            ${payslips.reduce((acc, curr) => acc + parseFloat(curr.netSalary || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                        <div className="mt-6 flex items-center justify-between">
                            <span className="text-blue-200 text-xs">Payroll Cycle: Monthly</span>
                            <CheckCircle2 className="w-4 h-4 text-blue-300" />
                        </div>
                    </div>
                    <CreditCard className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 transform -rotate-12" />
                </div>

                <div className="md:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl p-6 shadow-xl relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800/10 rounded-full -mr-32 -mt-32" />
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 text-left">Monthly Fiscal Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 text-left">
                        <div>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Gross Total</p>
                            <p className="text-lg font-bold text-[var(--text-primary)] mt-1">
                                ${payslips.reduce((acc, curr) => acc + parseFloat(curr.grossSalary || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Total Deductions</p>
                            <p className="text-lg font-bold text-red-500 mt-1">
                                -${payslips.reduce((acc, curr) => acc + parseFloat(curr.totalDeductions || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Recent Cycle</p>
                            <p className="text-lg font-bold text-blue-500 mt-1">
                                {payslips.length > 0 ? `${new Date(payslips[0].year, payslips[0].month - 1).toLocaleString('default', { month: 'short' })} ${payslips[0].year}` : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Disbursed Ratio</p>
                            <p className="text-lg font-bold text-green-500 mt-1">100%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xl transition-colors">
                <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center px-6">
                    <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest">Transaction Records</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        <input type="text" placeholder="Search records..." className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg py-1.5 pl-9 pr-4 text-xs text-[var(--text-primary)] focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)]/30 text-[var(--text-secondary)] text-[10px] uppercase tracking-widest">
                                <th className="px-6 py-4">{isAdmin ? 'Employee' : 'Month / Year'}</th>
                                <th className="px-6 py-4">Structure</th>
                                <th className="px-6 py-4">Total Deductions</th>
                                <th className="px-6 py-4">Net Payout</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 italic">Finding records...</td>
                                </tr>
                            ) : payslips.length === 0 ? (
                                <tr className="hover:bg-slate-800/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-[var(--text-primary)] font-bold">February 2026</div>
                                        <p className="text-[10px] text-[var(--text-secondary)]">Manual Entry</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">$5,000.00</td>
                                    <td className="px-6 py-4 text-sm text-red-500/80">$750.00</td>
                                    <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-mono font-bold">$4,250.00</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-bold uppercase">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            Processed
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-400 hover:text-blue-300 transition-colors">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ) : (
                                payslips.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-slate-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-[var(--text-primary)] font-bold">
                                                {isAdmin ? `${rec.Employee?.firstName} ${rec.Employee?.lastName}` : `${new Date(rec.year, rec.month - 1).toLocaleString('default', { month: 'long' })} ${rec.year}`}
                                            </div>
                                            <p className="text-[10px] text-[var(--text-secondary)]">{isAdmin ? rec.Employee?.employeeId : 'Monthly Salary'}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">${rec.grossSalary}</td>
                                        <td className="px-6 py-4 text-sm text-red-500/80">${rec.totalDeductions}</td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-mono font-bold">${rec.netSalary}</td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase ${rec.status === 'Paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${rec.status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                {rec.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => downloadPayslip(rec.id, rec.Employee?.firstName, rec.month, rec.year)}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Generate Modal */}
            <Modal isOpen={isGenerateModalOpen} onClose={() => setIsGenerateModalOpen(false)} title="Generate Monthly Payroll">
                <form onSubmit={handleGenerate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Target Month</label>
                            <select
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                                value={genData.month}
                                onChange={(e) => setGenData({ ...genData, month: e.target.value })}
                            >
                                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Fiscal Year</label>
                            <select
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                                value={genData.year}
                                onChange={(e) => setGenData({ ...genData, year: e.target.value })}
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex gap-3 text-left">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Generating payroll will automatically calculate salaries for all active employees based on their attendance and salary structure for the selected period.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsGenerateModalOpen(false)} className="px-6 py-2.5 text-slate-400 font-semibold">Cancel</button>
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all">
                            Initialize Generation
                        </button>
                    </div>
                </form>
            </Modal>
        </div >
    );
};

export default PayrollPage;
