import React from 'react';
import { Grid, HelpCircle } from 'lucide-react';

const boxes = [
    { id: '1-3', title: 'Rough Diamond', performance: 'Low', potential: 'High', color: 'bg-orange-500/10 border-orange-500/30' },
    { id: '2-3', title: 'Future Star', performance: 'Moderate', potential: 'High', color: 'bg-blue-500/10 border-blue-500/30' },
    { id: '3-3', title: 'Consistent Star', performance: 'High', potential: 'High', color: 'bg-emerald-500/10 border-emerald-500/30' },
    { id: '1-2', title: 'Inconsistent', performance: 'Low', potential: 'Moderate', color: 'bg-red-500/10 border-red-500/30' },
    { id: '2-2', title: 'Key Player', performance: 'Moderate', potential: 'Moderate', color: 'bg-yellow-500/10 border-yellow-500/30' },
    { id: '3-2', title: 'Current Star', performance: 'High', potential: 'Moderate', color: 'bg-teal-500/10 border-teal-500/30' },
    { id: '1-1', title: 'Underperformer', performance: 'Low', potential: 'Low', color: 'bg-rose-600/10 border-rose-600/30' },
    { id: '2-1', title: 'Solid Professional', performance: 'Moderate', potential: 'Low', color: 'bg-slate-500/10 border-slate-500/30' },
    { id: '3-1', title: 'High Professional', performance: 'High', potential: 'Low', color: 'bg-cyan-500/10 border-cyan-500/30' },
];

const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
};

const NineBoxGrid = ({ employees = [] }) => {
    // Map employees to their boxes
    // For demo purposes, generating random if empty
    const mappedData = employees.length > 0 ? employees : [
        { id: 1, firstName: 'Sarah', lastName: 'Connor', potentialScore: 3, performanceScore: 3 },
        { id: 2, firstName: 'John', lastName: 'Doe', potentialScore: 2, performanceScore: 3 },
        { id: 3, firstName: 'Jane', lastName: 'Smith', potentialScore: 2, performanceScore: 2 },
        { id: 4, firstName: 'Mike', lastName: 'Ross', potentialScore: 3, performanceScore: 1 },
        { id: 5, firstName: 'Rachel', lastName: 'Zane', potentialScore: 1, performanceScore: 2 },
    ];

    const getEmployeesInBox = (potential, performance) => {
        // Map qualitative names back to integer values
        const potMap = { 'Low': 1, 'Moderate': 2, 'High': 3 };
        const perfMap = { 'Low': 1, 'Moderate': 2, 'High': 3 };
        
        return mappedData.filter(e => 
            e.potentialScore === potMap[potential] && 
            e.performanceScore === perfMap[performance]
        );
    };

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Grid className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">9-Box Grid Mapping</h3>
                </div>
                <button className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors" title="How to read 9-Box">
                    <HelpCircle className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 flex flex-col relative w-full aspect-square md:aspect-auto">
                {/* Y Axis Label */}
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                    Potential
                </div>
                {/* X Axis Label */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[var(--text-secondary)] tracking-widest uppercase">
                    Performance
                </div>

                <div className="grid grid-cols-3 grid-rows-3 gap-2 flex-1 w-full h-full p-2">
                    {boxes.map((box) => {
                        const cellEmployees = getEmployeesInBox(box.potential, box.performance);
                        return (
                            <div key={box.id} className={`p-3 rounded-xl border flex flex-col ${box.color} transition-all hover:brightness-110 relative group`}>
                                <div className="text-[10px] sm:text-xs font-bold text-[var(--text-primary)] mb-1 leading-tight line-clamp-2">
                                    {box.title}
                                </div>
                                
                                <div className="flex flex-wrap gap-1 md:gap-2 mt-auto">
                                    {cellEmployees.map(emp => (
                                        <div 
                                            key={emp.id} 
                                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white shadow-md cursor-help"
                                            title={`${emp.firstName} ${emp.lastName}`}
                                        >
                                            {getInitials(emp.firstName, emp.lastName)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NineBoxGrid;
