import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'dark';
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 group flex items-center gap-2"
        >
            {isDark ? (
                <>
                    <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Light Mode</span>
                </>
            ) : (
                <>
                    <Moon className="w-5 h-5 text-indigo-400 group-hover:-rotate-12 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-wider hidden md:block">Dark Mode</span>
                </>
            )}
        </button>
    );
};

export default ThemeToggle;
