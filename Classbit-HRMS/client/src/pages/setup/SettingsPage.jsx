import React, { useState } from 'react';
import {
    Settings, Building, Shield, Bell,
    Globe, Mail, CreditCard, Users, Database,
    ChevronLeft, Briefcase
} from 'lucide-react';
import RoleManagement from './RoleManagement';
import CompanySettings from './CompanySettings';
import DepartmentManagement from './DepartmentManagement';
import StatutorySettings from './StatutorySettings';
import EmailSettingsView from './EmailSettingsView';
import { useSelector } from 'react-redux';

const SettingsPage = () => {
    const [currentView, setCurrentView] = useState('grid'); // 'grid', 'roles', 'company', etc.
    const { user } = useSelector((state) => state.auth);
    const isSuperAdmin = user?.role === 'Super Admin';
    const hasComplianceAccess = isSuperAdmin || user?.rolePermissions?.includes('Compliance');

    const sections = [
        ...(hasComplianceAccess ? [
            { id: 'compliance', name: 'Statutory Rules', icon: Database, desc: 'Manage dynamic PF, ESI, TDS brackets, and Professional Tax formulas.' },
        ] : []),
        ...(isSuperAdmin ? [
            { id: 'company', name: 'Company Details', icon: Building, desc: 'Manage company address, tax info, and logos.' },
            { id: 'depts', name: 'Departments', icon: Briefcase, desc: 'Configure organizational units and branches.' },
            { id: 'roles', name: 'Role Permissions', icon: Shield, desc: 'Configure what each system role can see and do.' },
            { id: 'email', name: 'Email Settings', icon: Mail, desc: 'SMTP configuration and email templates.' }
        ] : [])
    ];

    if (currentView !== 'grid') {
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <button
                    onClick={() => setCurrentView('grid')}
                    className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-blue-400 font-bold text-xs uppercase tracking-widest transition-colors mb-4"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Settings Hub
                </button>

                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 shadow-2xl transition-colors">
                    {currentView === 'roles' && <RoleManagement />}
                    {currentView === 'company' && <CompanySettings />}
                    {currentView === 'depts' && <DepartmentManagement />}
                    {currentView === 'compliance' && <StatutorySettings />}
                    {currentView === 'email' && <EmailSettingsView />}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] italic">System Settings Hub</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Configure global HRMS parameters and enterprise-grade policy settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => (
                    <div
                        key={section.id}
                        onClick={() => setCurrentView(section.id)}
                        className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xl hover:border-blue-500/50 transition-all group cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="w-14 h-14 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-blue-600 group-hover:text-white transition-all mb-6 border border-[var(--border-color)] shadow-lg">
                            <section.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] text-left italic">{section.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed text-left">
                            {section.desc}
                        </p>
                        <div className="mt-8 flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest group-hover:text-blue-500 transition-colors opacity-50">Configure Settings</span>
                            <div className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                                <ChevronLeft className="w-4 h-4 rotate-180 text-[var(--text-secondary)] group-hover:text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Actions Bar */}
            {isSuperAdmin && (
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl p-8 shadow-xl mt-8 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600" />
                    <h3 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-6 text-left">Enterprise Administration</h3>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] text-[var(--text-primary)] px-6 py-3 rounded-2xl text-sm font-bold border border-[var(--border-color)] transition-all hover:scale-105">
                            Lock Financial Year 2024-25
                        </button>
                        <button className="bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] text-[var(--text-secondary)] px-6 py-3 rounded-2xl text-sm font-bold border border-[var(--border-color)] transition-all hover:scale-105">
                            Force System-wide Cache Clear
                        </button>
                        <button className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl text-sm font-bold border border-red-500/20 transition-all">
                            Immediate Audit Report
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SettingsPage;
