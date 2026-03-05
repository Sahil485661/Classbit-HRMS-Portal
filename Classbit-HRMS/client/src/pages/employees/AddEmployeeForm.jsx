import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User, Mail, Lock, Briefcase,
    Database, UserCheck, Calendar
} from 'lucide-react';

const AddEmployeeForm = ({ onSuccess, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: initialData?.User?.email || '',
        password: '', // Leave blank for edit unless changing
        roleId: initialData?.User?.roleId || '',
        employeeId: initialData?.employeeId || '',
        departmentId: initialData?.departmentId || '',
        designation: initialData?.designation || '',
        gender: initialData?.gender || 'Male',
        joiningDate: initialData?.joiningDate || new Date().toISOString().split('T')[0]
    });

    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [rRes, dRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/employees/roles', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/employees/departments', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setRoles(rRes.data);
                setDepartments(dRes.data);
            } catch (err) {
                console.error('Failed to fetch roles/depts', err);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = initialData
                ? `http://localhost:5000/api/employees/${initialData.id}`
                : 'http://localhost:5000/api/employees';
            const method = initialData ? 'put' : 'post';

            // If editing and password is empty, don't send it
            const payload = { ...formData };
            if (initialData && !payload.password) delete payload.password;
            if (!initialData && !payload.password) payload.password = 'password123';

            await axios[method](url, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl py-2.5 px-4 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm";
    const labelClass = "text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-1.5 block ml-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
                        <input
                            type="text"
                            required
                            className={`${inputClass} pl-10`}
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="email"
                            required
                            className={`${inputClass} pl-10`}
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Employee ID</label>
                    <div className="relative">
                        <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            required
                            placeholder="e.g. EMP101"
                            className={`${inputClass} pl-10`}
                            value={formData.employeeId}
                            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Role</label>
                    <div className="relative">
                        <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            required
                            className={`${inputClass} pl-10 appearance-none`}
                            value={formData.roleId}
                            onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                        >
                            <option value="">Select Role</option>
                            {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label className={labelClass}>Department</label>
                    <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            required
                            className={`${inputClass} pl-10 appearance-none`}
                            value={formData.departmentId}
                            onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                        >
                            <option value="">Select Dept</option>
                            {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Designation</label>
                    <input
                        type="text"
                        required
                        className={inputClass}
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    />
                </div>
                <div>
                    <label className={labelClass}>Joining Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="date"
                            required
                            className={`${inputClass} pl-10`}
                            value={formData.joiningDate}
                            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-all font-semibold"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                >
                    {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    {loading ? 'Saving...' : (initialData ? 'Update Employee' : 'Create Employee')}
                </button>
            </div>
        </form>
    );
};

export default AddEmployeeForm;
