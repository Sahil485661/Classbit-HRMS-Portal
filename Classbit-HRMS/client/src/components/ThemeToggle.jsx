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
        <button
            onClick={toggleTheme}
            className="fixed bottom-8 right-8 p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700 group flex items-center justify-center shadow-xl shadow-blue-900/20 hover:scale-110 z-[999] hover:shadow-2xl hover:shadow-blue-500/20"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            {isDark ? (
                <Sun className="w-6 h-6 text-amber-400 group-hover:rotate-45 transition-transform" />
            ) : (
                <Moon className="w-6 h-6 text-indigo-400 group-hover:-rotate-12 transition-transform" />
            )}
        </button>
    );
};

export default ThemeToggle;
