import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    ArrowLeft, User, Mail, Phone, Briefcase, Calendar,
    MapPin, Flag, FileText, CreditCard, DollarSign,
    Clock, Users, Database, ShieldAlert, Heart, Activity
} from 'lucide-react';

const EmployeeDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`http://localhost:5000/api/employees/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEmployee(res.data);
            } catch (err) {
                console.error('Failed to fetch employee details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-[var(--text-secondary)] font-medium">Loading Employee Profile...</p>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <ShieldAlert className="w-16 h-16 text-red-500/50" />
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Employee Not Found</h2>
                <button
                    onClick={() => navigate('/employees')}
                    className="px-6 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--hover-bg)] transition-colors"
                >
                    Back to Directory
                </button>
            </div>
        );
    }

    // Design Tokens
    const cardClass = "bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-6 shadow-xl shadow-slate-200/5 dark:shadow-none hover:border-blue-500/30 transition-all";
    const sectionHeaderClass = "flex items-center gap-2 text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3 mb-5";
    const labelClass = "text-[10px] sm:text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1";
    const valueClass = "text-sm font-medium text-[var(--text-primary)] break-words";
    const iconWrapper = "p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-blue-500";

    const InfoBlock = ({ label, value, icon: Icon, span = 1 }) => (
        <div className={`col-span-1 md:col-span-${span} flex items-start gap-4 p-4 rounded-2xl bg-[var(--bg-secondary)]/30 border border-transparent hover:border-[var(--border-color)] transition-all`}>
            {Icon && (
                <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <div>
                <p className={labelClass}>{label}</p>
                <p className={valueClass}>{value || <span className="text-slate-400 italic">Not Provided</span>}</p>
            </div>
        </div>
    );

    return (
        <div className="font-sans space-y-6 pb-12 animate-in fade-in duration-500 max-w-7xl mx-auto">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                    onClick={() => navigate('/employees')}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-blue-500 font-semibold transition-colors bg-[var(--card-bg)] px-4 py-2 rounded-xl border border-[var(--border-color)]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Directory
                </button>
                <button
                    onClick={() => navigate(`/employees/edit/${employee.id}`, { state: { employee: employee } })}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
                >
                    Edit Profile
                </button>
            </div>

            {/* Profile Header Card */}
            <div className={`${cardClass} flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none" />
                
                {/* Avatar */}
                <div className="relative shrink-0 z-10">
                    {employee.profilePicture ? (
                        <img 
                            src={`http://localhost:5000/uploads/${employee.profilePicture}`} 
                            alt={employee.firstName} 
                            className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-4 border-[var(--bg-secondary)] shadow-2xl" 
                        />
                    ) : (
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 font-bold text-4xl border border-blue-500/20 shadow-2xl">
                            {employee.firstName?.[0]}{employee.lastName?.[0]}
                        </div>
                    )}
                    <div className={`absolute -bottom-3 -right-3 px-3 py-1.5 rounded-lg border-2 border-[var(--card-bg)] text-xs font-bold uppercase shadow-lg ${
                        employee.status === 'Active' ? 'bg-green-500 text-white' : 
                        employee.status === 'Inactive' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                        {employee.status}
                    </div>
                </div>

                {/* Primary Info */}
                <div className="flex-1 flex flex-col justify-center text-center md:text-left z-10 w-full">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
                        {employee.firstName} {employee.lastName}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-3 text-[var(--text-secondary)] font-medium">
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {employee.designation || 'Unassigned Role'}</span>
                        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1.5"><Database className="w-4 h-4" /> ID: {employee.employeeId}</span>
                        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
                        <span className="flex items-center gap-1.5 text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md"><Activity className="w-4 h-4" /> {employee.Department?.name || 'No Department'}</span>
                    </div>

                    {/* Quick Contacts */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6 pt-6 border-t border-[var(--border-color)]">
                        <a href={`mailto:${employee.User?.email}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-blue-500/50 hover:text-blue-500 transition-colors text-sm text-[var(--text-primary)] font-medium">
                            <Mail className="w-4 h-4 text-[var(--text-secondary)]" /> {employee.User?.email}
                        </a>
                        <a href={`tel:${employee.phone}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:border-emerald-500/50 hover:text-emerald-500 transition-colors text-sm text-[var(--text-primary)] font-medium">
                            <Phone className="w-4 h-4 text-[var(--text-secondary)]" /> {employee.phone || 'N/A'}
                        </a>
                    </div>
                </div>
            </div>

            {/* Grid Layout for Detailed Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Personal & Family Details */}
                <div className={cardClass}>
                    <h2 className={sectionHeaderClass}><Users className={iconWrapper} /> Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoBlock label="Date of Birth" value={employee.dob} icon={Calendar} />
                        <InfoBlock label="Gender" value={employee.gender} />
                        <InfoBlock label="Marital Status" value={employee.maritalStatus} icon={Heart} />
                        <InfoBlock label="Nationality" value={employee.nationality} icon={Flag} />
                        <InfoBlock label="Father's Name" value={employee.fatherName} span={2} />
                        <InfoBlock label="Mother's Name" value={employee.motherName} span={2} />
                    </div>
                </div>

                {/* Contact & Geography */}
                <div className={cardClass}>
                    <h2 className={sectionHeaderClass}><MapPin className={iconWrapper} /> Contact Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoBlock label="WhatsApp Number" value={employee.whatsappNumber} icon={Phone} />
                        <InfoBlock label="LinkedIn Profile" value={employee.linkedinProfile} icon={Briefcase} />
                        <InfoBlock label="Emergency Contact Name" value={employee.emergencyContactName} icon={Users} span={2} />
                        <InfoBlock label="Emergency Contact Phone" value={employee.emergencyContact} icon={ShieldAlert} span={2} />
                        <InfoBlock label="Current Address" value={employee.address} icon={MapPin} span={2} />
                    </div>
                </div>

                {/* Financials & Identity */}
                <div className={cardClass}>
                    <h2 className={sectionHeaderClass}><DollarSign className={iconWrapper} /> Salary & Bank Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoBlock label={`${employee.identityType || 'Identity'} Number`} value={employee.identityNumber} icon={FileText} span={2} />
                        <div className="col-span-1 md:col-span-2 border-t border-[var(--border-color)] mt-2 pt-4"></div>
                        <InfoBlock label="Bank Name" value={employee.bankName} icon={Database} />
                        <InfoBlock label="Account Holder" value={employee.accountHolderName} icon={User} />
                        <InfoBlock label="Account Number" value={employee.bankAccountNumber} icon={CreditCard} span={2} />
                        <InfoBlock label="IFSC Code" value={employee.bankIfscCode} icon={FileText} />
                        <InfoBlock label="UPI ID" value={employee.upiId} />
                    </div>
                </div>

                {/* Professional Data */}
                <div className={cardClass}>
                    <h2 className={sectionHeaderClass}><Briefcase className={iconWrapper} /> Employment Data</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <InfoBlock label="Date of Joining" value={employee.joiningDate} icon={Calendar} />
                        <InfoBlock label="Role Permissions" value={employee.User?.Role?.name || 'N/A'} icon={ShieldAlert} />
                        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/30 border border-transparent">
                            <p className={labelClass}>System Access Activity</p>
                            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2 mt-1">
                                <Clock className="w-4 h-4" /> Last Login: {employee.User?.lastLogin ? new Date(employee.User.lastLogin).toLocaleString() : 'Never logged in'}
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Loan History Module */}
            <div className={cardClass}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-bold text-[var(--text-primary)]">
                        <CreditCard className="w-6 h-6 p-1 rounded-lg bg-blue-500/10 text-blue-500" />
                        Loan & Advance History
                    </h2>
                </div>

                {(!employee.Loans || employee.Loans.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-[var(--bg-secondary)]/50 border border-dashed border-[var(--border-color)]">
                        <div className="w-16 h-16 rounded-full bg-[var(--card-bg)] flex items-center justify-center shadow-sm mb-4">
                            <Database className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">No Loans Found</h3>
                        <p className="text-[var(--text-secondary)] text-sm max-w-sm text-center mt-2">
                            This employee has not requested or been issued any financial loans or advances recorded in the system.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Issue Date</th>
                                    <th className="px-6 py-4 font-bold">Amount</th>
                                    <th className="px-6 py-4 font-bold">Duration</th>
                                    <th className="px-6 py-4 font-bold">Installment</th>
                                    <th className="px-6 py-4 font-bold max-w-[200px]">Reason</th>
                                    <th className="px-6 py-4 font-bold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-color)]">
                                {employee.Loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-[var(--bg-secondary)]/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                                            {new Date(loan.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-[var(--text-primary)]">₹{Number(loan.amount).toLocaleString()}</span>
                                            {loan.remainingAmount > 0 && (
                                                <p className="text-[10px] text-red-500 font-semibold mt-1">₹{Number(loan.remainingAmount).toLocaleString()} left</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] font-medium">
                                            {loan.repaymentMonths} months
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">
                                            ₹{Number(loan.monthlyInstallment).toLocaleString()}/mo
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] max-w-[200px] truncate" title={loan.reason}>
                                            {loan.reason}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                                loan.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                                loan.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                loan.status === 'Completed' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                                {loan.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default EmployeeDetailsPage;
