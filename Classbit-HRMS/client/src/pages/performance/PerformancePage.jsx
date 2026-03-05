import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { TrendingUp, Star, Award, Target, ChevronRight, FileText } from 'lucide-react';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis,
    ResponsiveContainer
} from 'recharts';

const PerformancePage = () => {
    const { user } = useSelector((state) => state.auth);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPerformance = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/performance/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReviews(res.data);
        } catch (error) {
            console.error('Error fetching performance:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPerformance();
    }, []);

    const performanceData = [
        { subject: 'Productivity', A: 120, fullMark: 150 },
        { subject: 'Reliability', A: 98, fullMark: 150 },
        { subject: 'Communication', A: 86, fullMark: 150 },
        { subject: 'Technical skills', A: 99, fullMark: 150 },
        { subject: 'Teamwork', A: 85, fullMark: 150 },
        { subject: 'Creativity', A: 65, fullMark: 150 },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Performance Analytics</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Track your growth, reviews, and KPIs.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Radar Chart */}
                <div className="lg:col-span-2 bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl transition-colors">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        Skills Analysis
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                                <PolarGrid stroke="var(--border-color)" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                                <Radar
                                    name="Employee"
                                    dataKey="A"
                                    stroke="#818cf8"
                                    fill="#818cf8"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Level/Badge Widget */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 text-center">
                            <div className="w-20 h-20 bg-white/20 rounded-2xl rotate-12 flex items-center justify-center mx-auto backdrop-blur-md border border-white/30">
                                <Award className="w-10 h-10 -rotate-12" />
                            </div>
                            <h4 className="text-xl font-bold mt-6">Senior Level II</h4>
                            <p className="text-indigo-200 text-sm mt-1">Software Engineering</p>

                            <div className="mt-8 flex justify-center gap-4">
                                <div className="text-center">
                                    <p className="text-xs opacity-70">Total Rank</p>
                                    <p className="font-bold">#4 / 120</p>
                                </div>
                                <div className="w-px h-8 bg-white/20" />
                                <div className="text-center">
                                    <p className="text-xs opacity-70">Points</p>
                                    <p className="font-bold">2,450 XP</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl transition-colors">
                        <h4 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-4">Core Objectives</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Project Milestones', progress: 85, color: 'bg-blue-500' },
                                { label: 'Technical Learning', progress: 60, color: 'bg-purple-500' },
                            ].map((obj, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span className="text-[var(--text-primary)]">{obj.label}</span>
                                        <span className="text-[var(--text-secondary)]">{obj.progress}%</span>
                                    </div>
                                    <div className="w-full bg-[var(--bg-secondary)] h-1.5 rounded-full overflow-hidden">
                                        <div className={`${obj.color} h-full`} style={{ width: `${obj.progress}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl transition-colors">
                <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Appraisals</h3>
                    <button className="text-blue-400 text-sm hover:underline">View All Feedback</button>
                </div>
                <div className="divide-y divide-slate-800">
                    {loading ? (
                        <div className="p-8 text-center text-[var(--text-secondary)] italic">Analyzing performance records...</div>
                    ) : reviews.length === 0 ? (
                        <div className="p-8 text-center text-[var(--text-secondary)] italic text-sm">No appraisal records found. Keep up the great work!</div>
                    ) : (
                        reviews.map((rev, i) => (
                            <div key={rev.id} className="p-6 flex items-center justify-between hover:bg-[var(--bg-secondary)] transition-colors">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-[var(--bg-secondary)] rounded-xl flex items-center justify-center border border-[var(--border-color)]">
                                        <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[var(--text-primary)]">
                                            {new Date(0, rev.month - 1).toLocaleString('default', { month: 'long' })} {rev.year}
                                        </h4>
                                        <p className="text-xs text-[var(--text-secondary)]">Reviewed by Admin</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[var(--text-primary)]">{rev.overallScore}/5</p>
                                        <p className="text-[10px] text-green-400 uppercase font-bold tracking-tight">Processed</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformancePage;
