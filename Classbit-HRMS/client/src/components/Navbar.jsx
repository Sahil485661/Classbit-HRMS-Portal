import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Search, User } from 'lucide-react';
import NotificationHub from './NotificationHub';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="h-16 bg-[var(--card-bg)] backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
            <div className="flex items-center gap-4 bg-[var(--bg-secondary)] px-4 py-2 rounded-lg border border-[var(--border-color)] w-96">
                <Search className="w-4 h-4 text-[var(--text-secondary)]" />
                <input
                    type="text"
                    placeholder="Search modules..."
                    className="bg-transparent border-none outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] w-full"
                />
            </div>

            <div className="flex items-center gap-6">
                <NotificationHub />

                <div className="h-8 w-[1px] bg-[var(--border-color)]" />

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-[var(--text-secondary)]">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white ring-2 bg-[var(--border-color)] shadow-lg">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="ml-4 p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors tooltip"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;
