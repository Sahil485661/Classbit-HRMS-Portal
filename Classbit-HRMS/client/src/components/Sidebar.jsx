import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard, Users, Clock, Briefcase,
    CreditCard, Calendar, BarChart3, Wallet,
    MessageSquare, Settings, UserCog, ClipboardList,
    AlertCircle, TrendingUp, UserPlus, History
} from 'lucide-react';

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);
    const role = user?.role;

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Employees', icon: Users, path: '/employees', roles: ['Super Admin', 'HR', 'Manager'] },
        { name: 'Attendance', icon: Clock, path: '/attendance', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Work', icon: Briefcase, path: '/work', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Payroll', icon: CreditCard, path: '/payroll', roles: ['Super Admin', 'HR', 'Employee'] },
        { name: 'Leave', icon: Calendar, path: '/leave', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Performance', icon: TrendingUp, path: '/performance', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Loan', icon: Wallet, path: '/loan', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Recruitment', icon: UserPlus, path: '/recruitment', roles: ['Super Admin', 'HR'] },
        { name: 'Grievance', icon: AlertCircle, path: '/grievance', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Accounting', icon: BarChart3, path: '/accounting', roles: ['Super Admin'] },
        { name: 'Messages', icon: MessageSquare, path: '/messages', roles: ['Super Admin', 'HR', 'Manager', 'Employee'] },
        { name: 'Managers', icon: UserCog, path: '/managers', roles: ['Super Admin'] },
        { name: 'Reports', icon: ClipboardList, path: '/reports', roles: ['Super Admin', 'HR'] },
        { name: 'Setup', icon: Settings, path: '/setup', roles: ['Super Admin'] },
        { name: 'Activities', icon: History, path: '/activities', roles: ['Super Admin'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    return (
        <aside className="w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border-color)] flex flex-col h-full transition-colors">
            <div className="p-6">
                <h2 className="text-xl font-bold text-blue-400">Classbit HRM</h2>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                {filteredItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
              ${isActive
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }
            `}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 uppercase font-semibold">User Role</p>
                    <p className="text-sm text-slate-300 mt-1">{role}</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
