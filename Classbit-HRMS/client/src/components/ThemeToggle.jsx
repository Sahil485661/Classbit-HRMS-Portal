import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const theme = localStorage.getItem('theme') || 'dark';
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-mode');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light-mode');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            document.documentElement.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light-mode');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <div className="p-4 border-t border-[var(--border-color)] mt-auto shrink-0">
            <button
                onClick={toggleTheme}
                className="w-full bg-[var(--bg-secondary)] hover:bg-[var(--hover-bg)] p-3.5 rounded-xl border border-[var(--border-color)] transition-all flex items-center justify-between group shadow-sm hover:shadow-md"
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                <div className="text-left flex flex-col gap-1">
                    <span className="text-[10px] text-[var(--text-secondary)] uppercase font-black tracking-widest">Appearance</span>
                    <span className="text-[13px] font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                        {isDark ? 'Dark Mode' : 'Light Mode'}
                    </span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] flex items-center justify-center shadow-inner group-hover:scale-105 transition-all">
                    {isDark ? (
                        <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform" />
                    ) : (
                        <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" />
                    )}
                </div>
            </button>
        </div>
    );
};

export default ThemeToggle;
