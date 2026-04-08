import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard, Users, Clock, Briefcase,
    CreditCard, Calendar, BarChart3, Wallet,
    MessageSquare, Settings, UserCog, ClipboardList,
    AlertCircle, TrendingUp, UserPlus, History, Receipt,
    ChevronDown, ChevronRight, Bell
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;
    const location = useLocation();
    
    // Auto-open Attendance if active path is under attendance or leave
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(
        location.pathname.startsWith('/attendance') || location.pathname.startsWith('/leave')
    );

    const permissions = user?.permissions; // undefined if old session

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Super Admin', 'HR', 'Manager', 'Employee'], permissionKey: 'Dashboard' },
        { name: 'Notice Board', icon: Bell, path: '/notices', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Events', icon: Calendar, path: '/calendar', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Employees', icon: Users, path: '/employees', roles: ['Super Admin', 'HR', 'Manager'], permissionKey: 'Employees' },
        { 
            name: 'Attendance', 
            icon: Clock, 
            path: '#', // Submenu parent doesn't need strict path
            roles: ['Super Admin', 'HR', 'Manager', 'Employee'], 
            permissionKey: 'Attendance',
            subItems: [
                { name: 'Attendance Log', path: '/attendance' },
                { name: 'Leave', path: '/leave' }
            ]
        },
        { name: 'Work', icon: Briefcase, path: '/work', roles: ['Super Admin', 'HR', 'Manager', 'Employee'], permissionKey: 'Tasks' },
        { name: 'Payroll', icon: CreditCard, path: '/payroll', roles: ['Super Admin', 'HR', 'Employee'], permissionKey: 'Payroll' },
        { name: 'Reimbursements', icon: Receipt, path: '/reimbursements', roles: ['Super Admin', 'HR', 'Manager', 'Employee'], permissionKey: 'Reimbursements' },
        { name: 'Loan', icon: Wallet, path: '/loan', disabled: role !== 'Super Admin', roles: ['Super Admin', 'HR', 'Manager', 'Employee'], permissionKey: 'Loans' },
        { name: 'Grievance', icon: AlertCircle, path: '/grievance', roles: ['Super Admin', 'HR', 'Manager', 'Employee'], permissionKey: 'Grievances' },
        { name: 'Accounting', icon: BarChart3, path: '/accounting', roles: ['Super Admin'] },
        { name: 'Messages', icon: MessageSquare, path: '/messages', roles: ['Super Admin', 'HR', 'Manager', 'Employee'], permissionKey: 'Messages' },
        { name: 'Managers', icon: UserCog, path: '/managers', roles: ['Super Admin'] },
        { name: 'Reports', icon: ClipboardList, path: '/reports', roles: ['Super Admin', 'HR'] },
        { name: 'Setup', icon: Settings, path: '/setup', roles: ['Super Admin', 'HR'], permissionKey: 'Settings' },
        { name: 'Activities', icon: History, path: '/activities', roles: ['Super Admin'] },
    ];

    const filteredItems = menuItems.filter(item => {
        if (role === 'Super Admin' && item.roles.includes('Super Admin')) return true;
        
        // Handle un-migrated JSON field where a role has literally zero permissions set in DB yet by the admin
        // OR handle old stale localStorage session that doesn't have permissions property
        if (permissions === undefined || permissions.length === 0) {
            return item.roles.includes(role);
        }

        if (item.permissionKey) {
            return permissions.includes(item.permissionKey);
        }
        return item.roles.includes(role);
    });

    return (
        <aside className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col h-full transition-colors">
            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-400">Classbit HRM</h2>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1 custom-scrollbar">
                {filteredItems.map((item) => {
                    if (item.subItems) {
                        return (
                            <div key={item.name} className="flex flex-col space-y-1">
                                <button
                                    onClick={() => setIsAttendanceOpen(!isAttendanceOpen)}
                                    className={`
                                        flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-bold transition-all sidebar-btn
                                        ${isAttendanceOpen ? 'bg-[var(--hover-bg)] text-[var(--text-primary)]' : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        {item.name}
                                    </div>
                                    {isAttendanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                </button>
                                
                                {isAttendanceOpen && (
                                    <div className="flex flex-col pl-11 pr-2 space-y-1 mt-1 animate-in slide-in-from-top-2 duration-200">
                                        {item.subItems.map((subItem) => (
                                            <NavLink
                                                key={subItem.name}
                                                to={subItem.path}
                                                className={({ isActive }) => `
                                                    block px-3 py-2 rounded-lg text-[13px] font-bold transition-all
                                                    ${isActive
                                                        ? 'bg-blue-600/10 text-[var(--text-primary)]'
                                                        : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'}
                                                `}
                                            >
                                                {subItem.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <NavLink
                            key={item.name}
                            to={item.disabled ? '#' : item.path}
                            onClick={(e) => {
                                if (item.disabled) {
                                    e.preventDefault();
                                    alert('This feature is temporarily disabled for your role.');
                                }
                            }}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all
                                ${item.disabled ? 'opacity-50 cursor-not-allowed text-[var(--text-secondary)]' : isActive
                                    ? 'bg-[var(--sidebar-bg)] shadow-[inset_4px_0_0_0_#3b82f6] text-[var(--text-primary)] bg-black/5 dark:bg-white/5'
                                    : 'text-[var(--text-primary)] hover:bg-[var(--hover-bg)]'
                                }
                            `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <ThemeToggle />
        </aside>
    );
};

export default Sidebar;
