import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Medal, Lightbulb, Heart, Zap, Send, X } from 'lucide-react';

const getTagIcon = (tag) => {
    switch (tag.toLowerCase()) {
        case '#leadership': return <Medal className="w-3 h-3 mr-1" />;
        case '#technical': return <Zap className="w-3 h-3 mr-1" />;
        case '#teamwork': return <Heart className="w-3 h-3 mr-1" />;
        case '#innovation': return <Lightbulb className="w-3 h-3 mr-1" />;
        default: return <ThumbsUp className="w-3 h-3 mr-1" />;
    }
};

const getTagColor = (tag) => {
    switch (tag.toLowerCase()) {
        case '#leadership': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case '#technical': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        case '#teamwork': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        case '#innovation': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
};

const FeedbackFeed = ({ feedbacks = [], onSubmit, employeesList = [], currentUserId }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [text, setText] = useState('');
    const [targetEmployeeId, setTargetEmployeeId] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    
    const availableTags = ['#Leadership', '#Technical', '#Teamwork', '#Innovation'];

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!targetEmployeeId || !text.trim()) return alert('Please select an employee and enter feedback.');
        
        await onSubmit({ targetEmployeeId, text, tags: selectedTags, type: 'Peer' });
        
        // Reset form
        setText('');
        setTargetEmployeeId('');
        setSelectedTags([]);
        setIsFormOpen(false);
    };

    const displayFeedbacks = feedbacks.length > 0 ? feedbacks : [];

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-xl flex flex-col h-full max-h-[500px]">
            <div className="p-6 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Feedback Feed</h3>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar relative">
                {displayFeedbacks.length === 0 ? (
                    <div className="text-center text-[var(--text-secondary)] italic mt-10 text-sm">No feedback received yet.</div>
                ) : (
                    <>
                        {/* Timeline line */}
                        <div className="absolute left-[40px] top-6 bottom-6 w-px bg-[var(--border-color)] z-0" />

                        <div className="space-y-6 relative z-10">
                            {displayFeedbacks.map((fb) => {
                                // Dynamic Title and Details Logic
                                let titleText = '';
                                let subText = '';
                                let initials = 'SYS';
                                let isSentByMe = fb.authorId === currentUserId;

                                if (isSentByMe) {
                                    const target = fb.TargetEmployee;
                                    titleText = target ? `You gave feedback to ${target.firstName} ${target.lastName}` : 'You gave feedback';
                                    subText = target ? `${target.designation} • ${target.Department?.name || 'Department'}` : '';
                                    initials = target ? `${target.firstName[0]}${target.lastName[0]}`.toUpperCase() : 'YOU';
                                } else {
                                    const authorEmp = fb.Author?.Employee;
                                    titleText = authorEmp ? `${authorEmp.firstName} ${authorEmp.lastName}` : (fb.Author?.email || 'System / Peer');
                                    subText = authorEmp ? `${authorEmp.designation || 'Colleague'} • ${authorEmp.Department?.name || 'Department'}` : '';
                                    initials = authorEmp ? `${authorEmp.firstName[0]}${authorEmp.lastName[0]}`.toUpperCase() : (fb.Author?.email ? fb.Author.email.substring(0, 2).toUpperCase() : 'FB');
                                }

                                return (
                                    <div key={fb.id} className="flex gap-4 group">
                                        <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-md border ${isSentByMe ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-700 border-slate-600'} text-white`}>
                                            {initials}
                                        </div>
                                        
                                        <div className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] p-4 rounded-xl rounded-tl-none relative group-hover:border-blue-500/30 transition-colors">
                                            {/* Triangle pointer */}
                                            <div className="absolute top-0 -left-[5px] w-0 h-0 border-t-[5px] border-r-[5px] border-b-[5px] border-transparent border-t-[var(--border-color)] border-r-[var(--bg-secondary)]" />

                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1">
                                                <div>
                                                    <span className="text-sm font-bold text-[var(--text-primary)] block leading-none">{titleText}</span>
                                                    {subText && <span className="text-[10px] sm:text-xs text-[var(--text-secondary)] font-medium mt-1 inline-block">{subText}</span>}
                                                </div>
                                                <span className="text-[10px] text-[var(--text-muted)] shrink-0 pl-1 border-l border-[var(--border-color)] sm:border-0 sm:pl-0">
                                                    {new Date(fb.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-2 p-3 bg-[var(--card-bg)] rounded-lg border border-[var(--border-color)]/50">
                                                {fb.text}
                                            </p>
                                            
                                            {fb.tags && fb.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {fb.tags.map(tag => (
                                                        <span key={tag} className={`flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold ${getTagColor(tag)}`}>
                                                            {getTagIcon(tag)}{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
            
            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-secondary)] rounded-b-2xl">
                {!isFormOpen ? (
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                        Give Feedback
                    </button>
                ) : (
                    <form onSubmit={handleSubmit} className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-bold text-[var(--text-primary)]">New Feedback</span>
                            <button type="button" onClick={() => setIsFormOpen(false)} className="text-[var(--text-muted)] hover:text-red-400 border border-transparent hover:border-red-400/30 rounded p-1 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <select 
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] mb-3 outline-none focus:ring-2 focus:ring-blue-500/50"
                            value={targetEmployeeId}
                            onChange={e => setTargetEmployeeId(e.target.value)}
                        >
                            <option value="">-- Select Colleague --</option>
                            {employeesList.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.designation})</option>
                            ))}
                        </select>

                        <textarea 
                            className="w-full h-20 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl p-3 text-sm text-[var(--text-primary)] outline-none resize-none mb-2 focus:ring-2 focus:ring-blue-500/50 custom-scrollbar"
                            placeholder="Great job on..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                        />

                        <div className="flex flex-wrap gap-2 mb-4">
                            {availableTags.map(tag => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => toggleTag(tag)}
                                    className={`px-2 py-1 rounded text-[10px] border font-semibold transition-colors ${selectedTags.includes(tag) ? 'bg-blue-500 text-white border-blue-600 shadow-sm' : 'bg-[var(--card-bg)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-blue-400'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        <button 
                            type="submit" 
                            disabled={!text.trim() || !targetEmployeeId}
                            className="w-full py-2.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none text-white text-sm font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" /> Submit Feedback
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default FeedbackFeed;
