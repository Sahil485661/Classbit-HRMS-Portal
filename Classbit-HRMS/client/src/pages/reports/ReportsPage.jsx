import React, { useState } from 'react';
import axios from 'axios';
import {
    FileBarChart, FileText, Download, Filter,
    Calendar, TrendingUp, Users, CreditCard
} from 'lucide-react';

const ReportsPage = () => {
    const [reportType, setReportType] = useState('attendance');
    const [loading, setLoading] = useState(false);

    const handleExportCSV = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/reports/${reportType}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data;
            
            if (!data || data.length === 0) {
                alert('No data available for this report type.');
                return;
            }

            const headers = Object.keys(data[0]);
            const csvRows = [];
            csvRows.push(headers.join(','));

            for (const row of data) {
                const values = headers.map(header => {
                    const val = row[header] === null || row[header] === undefined ? '' : row[header];
                    const escaped = ('' + val).replace(/"/g, '""');
                    return `"${escaped}"`;
                });
                csvRows.push(values.join(','));
            }

            const csvString = csvRows.join('\n');
            const blob = new Blob([csvString], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.setAttribute('hidden', '');
            a.setAttribute('href', url);
            a.setAttribute('download', `${reportType}_report_${new Date().getTime()}.csv`);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting report:', error);
            alert('Failed to generate report. Only Admins or HR can execute this action.');
        } finally {
            setLoading(false);
        }
    };

    const reportCards = [
        { id: 'attendance', name: 'Attendance Report', desc: 'Punch-in/out patterns and working hours.', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'payroll', name: 'Payroll Summary', desc: 'Total disbursements, tax, and net payouts.', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { id: 'performance', name: 'KPI Analytics', desc: 'Employee productivity and appraisal trends.', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { id: 'employees', name: 'Staff Census', desc: 'Demographics, departments, and headcount.', icon: Users, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)] italic">Enterprise Data Intelligence</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Generate and export multi-dimensional corporate reports.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportCards.map((report) => (
                    <div
                        key={report.id}
                        onClick={() => setReportType(report.id)}
                        className={`bg-[var(--card-bg)] border p-6 rounded-3xl shadow-xl transition-all cursor-pointer group ${reportType === report.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-[var(--border-color)] hover:border-blue-500/50'}`}
                    >
                        <div className={`w-12 h-12 ${report.bg} ${report.color} rounded-2xl flex items-center justify-center mb-6 transition-all group-hover:scale-110`}>
                            <report.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)] italic">{report.name}</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-3 leading-relaxed">{report.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl p-8 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-[var(--border-color)]">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <FileBarChart className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] uppercase tracking-tight">
                                {reportCards.find(r => r.id === reportType)?.name} Node
                            </h2>
                            <p className="text-xs text-[var(--text-secondary)] font-bold italic">Refining data from internal memory hooks...</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-2.5 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-blue-400 transition-all">
                            <Filter className="w-4 h-4" />
                            Global Filters
                        </button>
                        <button onClick={() => alert('PDF formatting is natively handled via CSV exports in this version.')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md">
                            <Download className="w-4 h-4" />
                            Generate PDF
                        </button>
                        <button onClick={handleExportCSV} disabled={loading} className={`flex items-center gap-2 ${loading ? 'bg-slate-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md`}>
                            <Download className="w-4 h-4" />
                            {loading ? 'Exporting...' : 'Export CSV'}
                        </button>
                    </div>
                </div>

                <div className="py-20 text-center space-y-6">
                    <div className="w-24 h-24 bg-blue-500/5 rounded-full border-4 border-dashed border-blue-500/20 mx-auto flex items-center justify-center">
                        <FileText className="w-10 h-10 text-blue-500/40" />
                    </div>
                    <div className="max-w-md mx-auto">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] italic">Computational Pipeline Ready</h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-3">Select your parameters above and initialize the generation process. Our engine will aggregate metadata across all modules.</p>
                    </div>
                    <button onClick={handleExportCSV} disabled={loading} className="bg-[var(--bg-secondary)] border border-blue-500/30 px-10 py-3 rounded-2xl text-blue-400 text-sm font-bold hover:bg-blue-500 hover:text-white transition-all disabled:opacity-50">
                        {loading ? 'Initializing...' : 'Initialize Engine'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
