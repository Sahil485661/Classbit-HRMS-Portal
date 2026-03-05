import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart3, TrendingUp, TrendingDown, DollarSign,
    Plus, Search, Calendar, FileText, PieChart as PieIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Modal from '../../components/Modal';

const AccountingPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTx, setNewTx] = useState({
        type: 'Income',
        category: 'Revenue',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/accounting', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);

            const income = res.data.filter(t => t.type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
            const expense = res.data.filter(t => t.type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
            setSummary({ income, expense, balance: income - expense });
        } catch (error) {
            console.error('Error fetching accounting data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/accounting', newTx, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsModalOpen(false);
            setNewTx({ type: 'Income', category: 'Revenue', amount: '', description: '', date: new Date().toISOString().split('T')[0] });
            fetchData();
        } catch (error) {
            alert('Failed to add transaction');
        }
    };

    const chartData = [
        { name: 'Income', amount: summary.income, color: '#10b981' },
        { name: 'Expense', amount: summary.expense, color: '#ef4444' }
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] italic">ERP Accounting Console</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Real-time financial tracking and expenditure management.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg"
                >
                    <Plus className="w-5 h-5" />
                    New Entry
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Net Liquidity', value: summary.balance, icon: DollarSign, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: 'Global Income', value: summary.income, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    { label: 'Total Burn Rate', value: summary.expense, icon: TrendingDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                    { label: 'Tax Reserves', value: summary.balance * 0.1, icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Feed</span>
                        </div>
                        <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1 italic">${stat.value.toLocaleString()}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] p-8 rounded-3xl shadow-xl">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-8 italic">Financial Flow Analysis</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--text-secondary)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)', borderRadius: '12px' }}
                                    itemStyle={{ color: 'var(--text-primary)' }}
                                />
                                <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-[var(--border-color)]">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] italic">Recent Ledger</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-12 text-center text-[var(--text-secondary)] italic">Syncing with blockchain...</div>
                        ) : transactions.length === 0 ? (
                            <div className="p-12 text-center text-[var(--text-secondary)] italic">No transactions found.</div>
                        ) : (
                            transactions.slice(0, 10).map((tx) => (
                                <div key={tx.id} className="p-5 border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)]/30 transition-all flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-xl ${tx.type === 'Income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                            {tx.type === 'Income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{tx.category}</p>
                                            <p className="text-[10px] text-[var(--text-secondary)]">{tx.description || 'Enterprise op.'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${tx.type === 'Income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {tx.type === 'Income' ? '+' : '-'}${parseFloat(tx.amount).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-[var(--text-secondary)] italic">{new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <button className="w-full p-4 text-xs font-bold text-indigo-400 hover:bg-indigo-500/5 transition-colors border-t border-[var(--border-color)]">
                        Extract Full Audit Report
                    </button>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Financial Transaction Node">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Entry Type</label>
                            <select
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                                value={newTx.type}
                                onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}
                            >
                                <option value="Income">Global Revenue (Income)</option>
                                <option value="Expense">Asset Expenditure (Expense)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Category</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                                placeholder="e.g. Payroll, Sales, Server"
                                value={newTx.category}
                                onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Amount (USD)</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                                placeholder="0.00"
                                value={newTx.amount}
                                onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Ledger Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                                value={newTx.date}
                                onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Brief Description</label>
                        <textarea
                            rows="3"
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl px-4 py-3 text-[var(--text-primary)] focus:outline-none"
                            placeholder="Metadata for the audit trail..."
                            value={newTx.description}
                            onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-[var(--text-secondary)] font-semibold">Abort</button>
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-2.5 rounded-2xl font-bold transition-all shadow-lg active:scale-95">
                            Commit Entry
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AccountingPage;
