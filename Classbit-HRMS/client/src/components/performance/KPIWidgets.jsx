import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import { TrendingUp, Target, ShieldCheck } from 'lucide-react';

const Sparkline = ({ data, color }) => (
    <div className="h-12 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={color} 
                    strokeWidth={2} 
                    dot={false} 
                    isAnimationActive={true} 
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

const KPIWidgets = ({ data = {} }) => {
    // Dummy trend data if real history is sparse
    const productivityTrend = data.productivityHistory || [
        { value: 65 }, { value: 70 }, { value: 68 }, { value: 85 }, { value: 82 }, { value: 95 }
    ];
    const attendanceTrend = data.attendanceHistory || [
        { value: 90 }, { value: 92 }, { value: 88 }, { value: 95 }, { value: 98 }, { value: 96 }
    ];
    const qualityTrend = data.qualityHistory || [
        { value: 75 }, { value: 78 }, { value: 80 }, { value: 85 }, { value: 88 }, { value: 92 }
    ];

    const kpis = [
        {
            title: "Productivity Score",
            value: data.productivity || "95%",
            trend: "+12% this month",
            icon: TrendingUp,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            stroke: "#60a5fa",
            chartData: productivityTrend
        },
        {
            title: "Attendance Rate",
            value: data.attendance || "96%",
            trend: "-2% this month",
            icon: ShieldCheck,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
            stroke: "#34d399",
            chartData: attendanceTrend
        },
        {
            title: "Quality Score",
            value: data.quality || "4.8/5",
            trend: "+0.2 this month",
            icon: Target,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            stroke: "#c084fc",
            chartData: qualityTrend
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {kpis.map((kpi, idx) => (
                <div key={idx} className="bg-[var(--card-bg)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg transition-colors overflow-hidden relative group">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">{kpi.title}</p>
                            <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-1">{kpi.value}</h3>
                            <p className={`text-[10px] font-bold mt-1 ${kpi.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {kpi.trend}
                            </p>
                        </div>
                        <div className={`p-3 rounded-xl ${kpi.bg}`}>
                            <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                        </div>
                    </div>
                    
                    <Sparkline data={kpi.chartData} color={kpi.stroke} />
                </div>
            ))}
        </div>
    );
};

export default KPIWidgets;
