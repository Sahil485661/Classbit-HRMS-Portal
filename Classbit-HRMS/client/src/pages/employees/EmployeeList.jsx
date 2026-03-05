import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Filter, Plus, MoreVertical,
    Mail, Phone, Calendar, BadgeCheck
} from 'lucide-react';
import Modal from '../../components/Modal';
import AddEmployeeForm from './AddEmployeeForm';

const EmployeeList = ({ title = "Employee Directory" }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ departmentId: '', status: '' });
    const [departments, setDepartments] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [importLoading, setImportLoading] = useState(false);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployees(res.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        fetchEmployees();
        fetchDepartments();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to deactivate this employee?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployees();
        } catch (error) {
            alert('Failed to deactivate employee');
        }
    };

    const handleReactivate = async (id) => {
        if (!window.confirm('Are you sure you want to reactivate this employee?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/employees/${id}/reactivate`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEmployees();
        } catch (error) {
            alert('Failed to reactivate employee');
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.Department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesDept = !filters.departmentId || emp.departmentId === parseInt(filters.departmentId);
        const matchesStatus = !filters.status || emp.status === filters.status;

        if (title === "Management Hierarchy") {
            const isLeader = emp.User?.role === 'Manager' || emp.User?.role === 'HR' || emp.User?.role === 'Super Admin';
            return matchesSearch && matchesDept && matchesStatus && isLeader;
        }
        return matchesSearch && matchesDept && matchesStatus;
    });

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target.result;
            const rows = text.split('\n').filter(row => row.trim());
            const headers = rows[0].split(',').map(h => h.trim());

            setImportLoading(true);
            let success = 0;
            let failure = 0;

            const token = localStorage.getItem('token');

            for (let i = 1; i < rows.length; i++) {
                const values = rows[i].split(',').map(v => v.trim());
                if (values.length < headers.length) continue;

                const empData = {};
                headers.forEach((h, index) => {
                    empData[h] = values[index];
                });

                try {
                    await axios.post('http://localhost:5000/api/employees', empData, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    success++;
                } catch (error) {
                    failure++;
                }
            }

            setImportLoading(false);
            alert(`Import Complete!\nSuccess: ${success}\nFailed: ${failure}`);
            fetchEmployees();
        };
        reader.readAsText(file);
    };

    const handleExportCSV = () => {
        if (filteredEmployees.length === 0) return alert('No data to export');

        const headers = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Department', 'Designation', 'Status'];
        const csvRows = filteredEmployees.map(emp => [
            emp.employeeId,
            emp.firstName,
            emp.lastName,
            emp.User?.email,
            emp.Department?.name || 'NA',
            emp.designation,
            emp.status
        ].join(','));

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Employees_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {title === "Management Hierarchy" ? "View and manage leadership and administrative staff." : "Manage and view all company employees."}
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingEmployee(null);
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
                >
                    <Plus className="w-5 h-5" />
                    Add Employee
                </button>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl overflow-hidden transition-colors">
                {/* Filters */}
                <div className="p-4 border-b border-[var(--border-color)] flex flex-col gap-4 bg-[var(--bg-secondary)]/30">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search by name, ID or department..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors"
                            >
                                Export
                            </button>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-all ${showFilters ? 'bg-blue-600 text-white border-blue-500' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]'}`}
                            >
                                <Filter className="w-4 h-4" />
                                {showFilters ? 'Hide Filters' : 'Filter'}
                            </button>
                            <input
                                type="file"
                                id="csvImport"
                                className="hidden"
                                accept=".csv"
                                onChange={handleImportCSV}
                            />
                            <button
                                onClick={() => document.getElementById('csvImport').click()}
                                disabled={importLoading}
                                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] transition-colors disabled:opacity-50"
                            >
                                {importLoading ? 'Importing...' : 'Import CSV'}
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--border-color)] animate-in slide-in-from-top-2 duration-300">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Department</label>
                                <select
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                                    value={filters.departmentId}
                                    onChange={(e) => setFilters({ ...filters, departmentId: e.target.value })}
                                >
                                    <option value="">All Departments</option>
                                    {departments.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase mb-1">Status</label>
                                <select
                                    className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)]"
                                    value={filters.status}
                                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                >
                                    <option value="">All Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={() => setFilters({ departmentId: '', status: '' })}
                                    className="px-4 py-2 text-sm text-blue-500 hover:text-blue-400 font-medium"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/30 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Employee</th>
                                <th className="px-6 py-4 font-semibold">Employee ID</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Designation</th>
                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            Loading employees...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">No employees found.</td>
                                </tr>
                            ) : (
                                filteredEmployees.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center text-blue-400 font-bold border border-[var(--border-color)] group-hover:border-blue-500/50 transition-colors">
                                                    {emp.firstName?.[0]}{emp.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{emp.firstName} {emp.lastName}</p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{emp.User?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400 font-mono">{emp.employeeId}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{emp.Department?.name || 'Unassigned'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{emp.designation}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${emp.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingEmployee(emp);
                                                        setIsAddModalOpen(true);
                                                    }}
                                                    className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                    title="Edit Employee"
                                                >
                                                    <Plus className="w-4 h-4 rotate-45" />
                                                </button>
                                                {emp.status === 'Inactive' ? (
                                                    <button
                                                        onClick={() => handleReactivate(emp.id)}
                                                        className="p-2 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"
                                                        title="Reactivate Employee"
                                                    >
                                                        <BadgeCheck className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(emp.id)}
                                                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                        title="Deactivate Employee"
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-center transition-colors">
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Showing {filteredEmployees.length} of {employees.length} employees</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)] disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg text-xs text-[var(--text-secondary)]">Next</button>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingEmployee(null);
                }}
                title={editingEmployee ? "Edit Employee" : "Add New Employee"}
            >
                <AddEmployeeForm
                    initialData={editingEmployee}
                    onSuccess={() => {
                        setIsAddModalOpen(false);
                        setEditingEmployee(null);
                        fetchEmployees();
                    }}
                    onCancel={() => {
                        setIsAddModalOpen(false);
                        setEditingEmployee(null);
                    }}
                />
            </Modal>
        </div>
    );
};

export default EmployeeList;
