import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard, Users, Clock, Briefcase,
    CreditCard, Calendar, BarChart3, Wallet,
    MessageSquare, Settings, UserCog, ClipboardList,
    AlertCircle, TrendingUp, UserPlus, History,
    ChevronDown, ChevronRight
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;
    const location = useLocation();
    
    // Auto-open Attendance if active path is under attendance or leave
    const [isAttendanceOpen, setIsAttendanceOpen] = useState(
        location.pathname.startsWith('/attendance') || location.pathname.startsWith('/leave')
    );

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Employees', icon: Users, path: '/employees', roles: ['Super Admin', 'HR', 'Manager'] },
        { 
            name: 'Attendance', 
            icon: Clock, 
            path: '#', // Submenu parent doesn't need strict path
            roles: ['Super Admin', 'HR', 'Manager', 'Employee'],
            subItems: [
                { name: 'Attendance Log', path: '/attendance' },
                { name: 'Leave', path: '/leave' }
            ]
        },
        { name: 'Work', icon: Briefcase, path: '/work', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Payroll', icon: CreditCard, path: '/payroll', roles: ['Super Admin', 'HR', 'Employee'] },
        { name: 'Performance', icon: TrendingUp, path: '/performance', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Loan', icon: Wallet, path: '/loan', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Recruitment', icon: UserPlus, path: '/recruitment', roles: ['Super Admin', 'HR'] },
        { name: 'Grievance', icon: AlertCircle, path: '/grievance', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Accounting', icon: BarChart3, path: '/accounting', roles: ['Super Admin'] },
        { name: 'Messages', icon: MessageSquare, path: '/messages', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Managers', icon: UserCog, path: '/managers', roles: ['Super Admin'] },
        { name: 'Reports', icon: ClipboardList, path: '/reports', roles: ['Super Admin', 'HR'] },
        { name: 'Setup', icon: Settings, path: '/setup', roles: ['Super Admin', 'HR'] },
        { name: 'Activities', icon: History, path: '/activities', roles: ['Super Admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

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
                                        flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-all
                                        ${isAttendanceOpen ? 'bg-[var(--hover-bg)] text-[var(--text-primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'}
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
                                                    block px-3 py-2 rounded-lg text-[13px] font-medium transition-all
                                                    ${isActive
                                                        ? 'bg-blue-600/10 text-blue-400 font-semibold'
                                                        : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'}
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
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                    : 'text-[var(--text-muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]'
                                }
                            `}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[var(--border-color)]">
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border-color)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase font-semibold">User Role</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{role}</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
