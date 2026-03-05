import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Plus, Trash2, Edit3, CheckCircle2 } from 'lucide-react';

const RoleManagement = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRole, setNewRole] = useState({ name: '', description: '' });
    const [showAdd, setShowAdd] = useState(false);

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/employees/roles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRoles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAddRole = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/employees/roles', newRole, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewRole({ name: '', description: '' });
            setShowAdd(false);
            fetchRoles();
        } catch (err) {
            alert('Failed to add role');
        }
    };

    return (
        <div className="space-y-6 text-left">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--text-primary)] italic">Access Control Roles</h2>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Create New Role
                </button>
            </div>

            {showAdd && (
                <form onSubmit={handleAddRole} className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-2xl animate-in slide-in-from-top-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Role Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                value={newRole.name}
                                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase block mb-2">Description</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                value={newRole.description}
                                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={() => setShowAdd(false)} className="text-[var(--text-secondary)] font-bold px-4">Cancel</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold">Save Role</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                    <p className="text-[var(--text-secondary)] italic">Syncing roles...</p>
                ) : roles.map(role => (
                    <div key={role.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-5 rounded-2xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-[var(--text-secondary)] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[var(--text-primary)]">{role.name}</h4>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{role.description || 'Global system permission set.'}</p>
                                <div className="mt-3 flex items-center gap-2">
                                    <span className="text-[10px] bg-[var(--bg-secondary)] text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoleManagement;
