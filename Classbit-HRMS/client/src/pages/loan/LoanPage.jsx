import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Wallet, Plus, Clock, CheckCircle, XCircle, DollarSign, AlertCircle } from 'lucide-react';
import Modal from '../../components/Modal';

const LoanPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        repaymentMonths: '12',
        reason: ''
    });

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem('token');
            const url = (user.role === 'Super Admin' || user.role === 'HR')
                ? 'http://localhost:5000/api/loan/all'
                : 'http://localhost:5000/api/loan/my';
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(res.data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLoans();
    }, [user.role]);

    const handleApply = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/loan/apply', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsApplyModalOpen(false);
            setFormData({ amount: '', repaymentMonths: '12', reason: '' });
            fetchLoans();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to apply for loan');
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/loan/${id}/status`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchLoans();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Loan Management</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Manage employee loans and repayment schedules.</p>
                </div>
                {user.role === 'Employee' && (
                    <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Apply for Loan
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Loans', value: loans.length, icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Pending Approval', value: loans.filter(l => l.status === 'Pending').length, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Active Loans', value: loans.filter(l => l.status === 'Approved').length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Paid Off', value: loans.filter(l => l.status === 'Completed').length, icon: DollarSign, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-[var(--text-primary)] mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl transition-colors">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Loan Applications</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[var(--bg-secondary)]/30 text-[var(--text-secondary)] text-[10px] uppercase tracking-widest">
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Reason</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-[var(--text-secondary)] italic">Loading loans...</td>
                                </tr>
                            ) : loans.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-[var(--text-secondary)] italic">No loan applications found.</td>
                                </tr>
                            ) : (
                                loans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-[var(--bg-secondary)] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xs">
                                                    {loan.Employee?.firstName[0]}{loan.Employee?.lastName[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-[var(--text-primary)]">{loan.Employee?.firstName} {loan.Employee?.lastName}</p>
                                                    <p className="text-[10px] text-[var(--text-secondary)]">{loan.Employee?.employeeId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-[var(--text-primary)]">${loan.amount}</td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{loan.repaymentMonths} Months</td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)] italic truncate max-w-xs">{loan.reason}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${loan.status === 'Approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                    loan.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {loan.status === 'Pending' && (user.role === 'Super Admin' || user.role === 'HR') ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleUpdateStatus(loan.id, 'Approved')}
                                                        className="p-1.5 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors" title="Approve">
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(loan.id, 'Rejected')}
                                                        className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors" title="Reject">
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-[10px] text-[var(--text-secondary)] italic">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Loan">
                <form onSubmit={handleApply} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Loan Amount ($)</label>
                        <input
                            type="number"
                            required
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                            placeholder="e.g. 5000"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Repayment Period (Months)</label>
                        <select
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                            value={formData.repaymentMonths}
                            onChange={(e) => setFormData({ ...formData, repaymentMonths: e.target.value })}
                        >
                            <option value="6">6 Months</option>
                            <option value="12">12 Months (1 Year)</option>
                            <option value="24">24 Months (2 Year)</option>
                            <option value="36">36 Months (3 Year)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Reason</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none"
                            placeholder="Please provide a reason for the loan request..."
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsApplyModalOpen(false)} className="px-6 py-2.5 text-[var(--text-secondary)] font-semibold">Cancel</button>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2.5 rounded-xl font-bold transition-all">
                            Submit Application
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LoanPage;
