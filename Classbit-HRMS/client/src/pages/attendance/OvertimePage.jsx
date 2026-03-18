import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Clock, Filter, Download } from 'lucide-react';

const OvertimePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ date: '', departmentId: '' });
    const [departments, setDepartments] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchOvertimeRecords();
        if (user.role !== 'Employee') {
            fetchDepartments();
        }
    }, [user.role, filters]);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/employees/departments', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDepartments(res.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchOvertimeRecords = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let url = user.role === 'Employee'
                ? 'http://localhost:5000/api/attendance/my'
                : 'http://localhost:5000/api/attendance/all';

            const params = new URLSearchParams();
            if (filters.date) params.append('date', filters.date);
            if (filters.departmentId) params.append('departmentId', filters.departmentId);

            const res = await axios.get(`${url}?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Filter only records with overtime > 0
            const overtimeRecords = res.data.filter(rec => rec.overtime > 0);
            setRecords(overtimeRecords);
        } catch (error) {
            console.error('Error fetching overtime records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (records.length === 0) return alert('No records to export');

        const headers = user.role !== 'Employee'
            ? ['Employee Name', 'Employee ID', 'Date', 'Working Hours', 'Overtime Hours']
            : ['Date', 'Working Hours', 'Overtime Hours'];

        const csvContent = [
            headers.join(','),
            ...records.map(rec => {
                const row = [];
                if (user.role !== 'Employee') {
                    row.push(`"${rec.Employee?.firstName} ${rec.Employee?.lastName}"`);
                    row.push(`"${rec.Employee?.employeeId}"`);
                }
                row.push(`"${new Date(rec.date).toLocaleDateString()}"`);
                row.push(`"${rec.workingHours || 0}h"`);
                row.push(`"${rec.overtime || 0}h"`);
                return row.join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `Overtime_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Overtime Records</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {user.role === 'Employee' ? 'View your overtime details.' : 'Monitor and manage employee overtime records.'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${showFilters ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                    >
                        <Filter className="w-4 h-4" />
                        {showFilters ? 'Hide Filters' : 'Filter'}
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            {showFilters && (
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-4 rounded-2xl shadow-lg animate-in slide-in-from-top-2 duration-300">
                    <div className="flex gap-4 flex-wrap items-end">
                        <div className="space-y-1.5 flex-1 min-w-[200px] text-left">
                            <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Date</label>
                            <input
                                type="date"
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>
                        {user.role !== 'Employee' && (
                            <div className="space-y-1.5 flex-1 min-w-[200px] text-left">
                                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ml-1">Department</label>
                                <select
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    value={filters.departmentId}
                                    onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <button
                            onClick={() => setFilters({ date: '', departmentId: '' })}
                            className="h-[38px] px-4 text-xs font-bold text-red-400 hover:text-red-300 transition-colors uppercase"
                        >
                            Reset
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-xl transition-colors standard-table">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-theme-header text-theme-muted text-[10px] uppercase tracking-widest">
                                {user.role !== 'Employee' && <th className="px-6 py-4 font-semibold">Employee</th>}
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Working Hours</th>
                                <th className="px-6 py-4 font-semibold">Overtime Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-color)]">
                            {loading ? (
                                <tr>
                                    <td colSpan={user.role !== 'Employee' ? 4 : 3} className="px-6 py-12 text-center text-slate-500 italic">Loading records...</td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={user.role !== 'Employee' ? 4 : 3} className="px-6 py-12 text-center text-slate-500 italic">No overtime records found.</td>
                                </tr>
                            ) : (
                                records.map((rec) => (
                                    <tr key={rec.id} className="hover:bg-slate-800/20 transition-colors">
                                        {user.role !== 'Employee' && (
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                                    {rec.Employee?.firstName} {rec.Employee?.lastName}
                                                </div>
                                                <div className="text-[10px] text-[var(--text-secondary)]">{rec.Employee?.employeeId}</div>
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                                            {new Date(rec.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-[var(--text-primary)] font-mono">
                                            {rec.workingHours}h
                                        </td>
                                        <td className="px-6 py-4 text-sm text-blue-400 font-bold font-mono">
                                            +{rec.overtime}h
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OvertimePage;
