import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    Clock, Briefcase, MessageSquare,
    Quote, Play, Square, CheckCircle2,
    Calendar, AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeeDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState(null);
    const [myWork, setMyWork] = useState([]);
    const [notices, setNotices] = useState([]);
    const [quote, setQuote] = useState(null);
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const headers = { Authorization: `Bearer ${token}` };

                // Fetch individually to prevent one failure from blocking others
                try {
                    const workRes = await axios.get('http://localhost:5000/api/tasks/my', { headers });
                    setMyWork(Array.isArray(workRes.data) ? workRes.data : []);
                } catch (e) {
                    console.error('Tasks fetch failed', e);
                    setMyWork([]);
                }

                try {
                    const noticeRes = await axios.get('http://localhost:5000/api/notices', { headers });
                    const allNotices = Array.isArray(noticeRes.data) ? noticeRes.data : [];
                    setNotices(allNotices.filter(n => n.type === 'Announcement' || n.type === 'Notice'));
                    setQuote(allNotices.find(n => n.type === 'Quote'));
                } catch (e) { console.error('Notices fetch failed', e); }

                try {
                    const attRes = await axios.get('http://localhost:5000/api/attendance/my', { headers });
                    const attData = Array.isArray(attRes.data) ? attRes.data : [];
                    const today = new Date().toLocaleDateString('en-CA');
                    const todayAtt = attData.find(a => a.date === today);
                    if (todayAtt && !todayAtt.checkOut) {
                        setIsClockedIn(true);
                        const checkInDate = new Date(todayAtt.checkIn);
                        setClockInTime(checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    } else {
                        setIsClockedIn(false);
                        setClockInTime(null);
                    }
                } catch (e) { console.error('Attendance fetch failed', e); }

                try {
                    const leaveRes = await axios.get('http://localhost:5000/api/leave/my', { headers });
                    setLeaves(Array.isArray(leaveRes.data) ? leaveRes.data : []);
                } catch (e) { console.error('Leaves fetch failed', e); }

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleClockToggle = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            if (!isClockedIn) {
                const res = await axios.post('http://localhost:5000/api/attendance/clock-in', {}, { headers });
                const checkInDate = new Date(res.data.checkIn);
                setClockInTime(checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                setIsClockedIn(true);
            } else {
                await axios.post('http://localhost:5000/api/attendance/clock-out', {}, { headers });
                setIsClockedIn(false);
                setClockInTime(null);
            }
            // Trigger a re-fetch of all dashboard data to ensure consistency
            const workRes = await axios.get('http://localhost:5000/api/tasks/my', { headers });
            setMyWork(workRes.data);
        } catch (error) {
            alert(error.response?.data?.message || 'Attendance action failed');
        }
    };



    const calculateDays = (start, end) => {
        const d1 = new Date(start);
        const d2 = new Date(end);
        const diff = Math.abs(d2 - d1);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const getRemainingPTO = () => {
        const currentYear = new Date().getFullYear();
        const annualApproved = leaves
            .filter(l =>
                l.status === 'Approved' &&
                Number(l.leaveTypeId) === 1 &&
                new Date(l.startDate).getFullYear() === currentYear
            )
            .reduce((acc, curr) => acc + calculateDays(curr.startDate, curr.endDate), 0);
        return Math.max(0, 20 - annualApproved);
    };

    if (loading) return <div className="p-8 text-slate-400 italic">Initializing workplace...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="text-left">
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] italic">
                        Welcome back, {user?.firstName}! ✨
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1 max-w-xl italic">
                        {quote ? `"${quote.content}" – ${quote.author || 'Unknown'}` : '"The only way to do great work is to love what you do." – Steve Jobs'}
                    </p>
                </div>

                {/* Attendance Widget */}
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-4 rounded-2xl flex items-center gap-6 shadow-xl relative overflow-hidden transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                    <div className="text-right relative z-10">
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase font-bold tracking-widest">Shift Status</p>
                        <p className="text-sm font-bold text-[var(--text-primary)] mt-1">
                            {isClockedIn ? `Working since ${clockInTime}` : 'Not Clocked In'}
                        </p>
                    </div>
                    <button
                        onClick={handleClockToggle}
                        className={`
                            relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg
                            ${isClockedIn
                                ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-900/20'
                                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
                            }
                        `}
                    >
                        {isClockedIn ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        {isClockedIn ? 'Clock Out' : 'Clock In'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Work List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-blue-400" />
                            My Assigned Work
                        </h3>
                        <button className="text-sm text-blue-400 hover:underline">View All Tasks</button>
                    </div>

                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xl transition-colors">
                        {myWork.length === 0 ? (
                            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
                                <CheckCircle2 className="w-10 h-10 opacity-20" />
                                <p>All caught up! No pending tasks assigned.</p>
                            </div>
                        ) : (
                            myWork.map((task, idx) => (
                                <div
                                    key={task.id}
                                    className={`p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors ${idx !== myWork.length - 1 ? 'border-b border-[var(--border-color)]' : ''}`}
                                >
                                    <div className="flex gap-4 items-center">
                                        <div className={`p-3 rounded-xl ${task.priority === 'High' ? 'bg-red-500/10 text-red-400' :
                                            task.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400' :
                                                'bg-blue-500/10 text-blue-400'
                                            }`}>
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[var(--text-primary)]">{task.title}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded uppercase font-bold tracking-tighter">
                                                    {task.priority} Priority
                                                </span>
                                                <span className="text-[10px] text-[var(--text-secondary)] font-medium">
                                                    Assigned by: {task.Creator?.Employee ? `${task.Creator.Employee.firstName} ${task.Creator.Employee.lastName}` : 'Admin'}
                                                </span>
                                                <span className="text-xs text-[var(--text-secondary)] italic">Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${task.status === 'Completed' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                            'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                            }`}>
                                            {task.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Announcements */}
                    <section>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-400" />
                            Internal Notices
                        </h3>
                        <div className="space-y-4">
                            {notices.length === 0 ? (
                                <p className="text-sm text-slate-500 italic p-4 border border-dashed border-slate-800 rounded-2xl">No active announcements</p>
                            ) : (
                                notices.map((msg, idx) => (
                                    <div key={msg.id} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg hover:border-amber-500/30 transition-all group">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{msg.title || 'Broadcast'}</span>
                                            <span className="text-[10px] text-[var(--text-secondary)]">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">{msg.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Leave Quick Action */}
                    <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/40">
                        <div className="relative z-10">
                            <h4 className="text-xs font-bold opacity-70 uppercase tracking-widest text-left">Available PTO</h4>
                            <p className="text-4xl font-black mt-2 text-left">{getRemainingPTO()} Days</p>
                            <button className="mt-6 bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all">
                                Request Leave Now
                            </button>
                        </div>
                        <Calendar className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 transform rotate-12" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;
