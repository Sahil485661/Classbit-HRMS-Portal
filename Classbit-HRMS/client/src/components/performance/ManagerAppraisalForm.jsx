import React, { useState } from 'react';
import { FileUp, Link as LinkIcon, Save, Send, Trash2, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

const ManagerAppraisalForm = ({ employeeName = "Employee", onSubmit }) => {
    // State Management for Draft vs Submit prevention
    const [comments, setComments] = useState('');
    const [sentiment, setSentiment] = useState('');
    const [evidence, setEvidence] = useState([]);
    
    // Status states
    const [isDrafting, setIsDrafting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newEvidence = files.map(f => ({ id: Math.random().toString(), name: f.name, type: 'file' }));
        setEvidence([...evidence, ...newEvidence]);
    };

    const handleAddLink = () => {
        const url = prompt("Enter evidence URL:");
        if (url) {
            setEvidence([...evidence, { id: Math.random().toString(), name: url, type: 'link' }]);
        }
    };

    const removeEvidence = (id) => {
        setEvidence(evidence.filter(e => e.id !== id));
    };

    const handleSaveDraft = () => {
        setIsDrafting(true);
        setTimeout(() => {
            alert('Draft saved securely.'); // Mock draft save
            setIsDrafting(false);
            if (onSubmit) onSubmit({ type: 'draft', comments, sentiment, evidence });
        }, 1000);
    };

    const handleFinalSubmit = () => {
        if (!sentiment) return alert('Please select a sentiment tag before final submission.');
        if (comments.length < 20) return alert('Manager comments must be at least 20 characters.');

        if (window.confirm("Are you sure? Final submission cannot be edited.")) {
            setIsSubmitting(true);
            setTimeout(() => {
                alert('Appraisal Submitted successfully!');
                setIsSubmitting(false);
                if (onSubmit) onSubmit({ type: 'submit', comments, sentiment, evidence });
            }, 1000);
        }
    };

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl flex flex-col w-full max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">HR Appraisal Submission</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-6">Evaluating: <span className="font-semibold">{employeeName}</span></p>

            {/* Manager Comments: Rich Text Area Simulation */}
            <div className="mb-6">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    Manager Comments (Rich Text)
                </label>
                <div className="border border-[var(--border-color)] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
                    {/* Simulated Toolbar */}
                    <div className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] p-2 flex gap-2 items-center">
                        <button className="p-1 hover:bg-slate-300/20 rounded font-bold px-2 text-sm text-[var(--text-primary)]">B</button>
                        <button className="p-1 hover:bg-slate-300/20 rounded italic px-2 text-sm text-[var(--text-primary)]">I</button>
                        <button className="p-1 hover:bg-slate-300/20 rounded underline px-2 text-sm text-[var(--text-primary)]">U</button>
                        <div className="w-px h-4 bg-[var(--border-color)] mx-1" />
                        <MessageSquare className="w-4 h-4 text-[var(--text-secondary)]" />
                    </div>
                    <textarea 
                        className="w-full h-40 p-4 bg-[var(--card-bg)] text-sm text-[var(--text-primary)] outline-none resize-y"
                        placeholder="Detail the employee's performance, strengths, and areas for growth..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                    />
                </div>
            </div>

            {/* Sentiment Tagging */}
            <div className="mb-6">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    Sentiment Tagging
                </label>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setSentiment('Positive')}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${sentiment === 'Positive' ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-green-500/30'}`}
                    >
                        <CheckCircle2 className="w-4 h-4" /> Positive
                    </button>
                    <button 
                        onClick={() => setSentiment('Neutral')}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${sentiment === 'Neutral' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-500/30'}`}
                    >
                        <AlertTriangle className="w-4 h-4" /> Neutral
                    </button>
                    <button 
                        onClick={() => setSentiment('Needs Improvement')}
                        className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-sm font-semibold transition-all ${sentiment === 'Needs Improvement' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-[var(--bg-secondary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-orange-500/30'}`}
                    >
                        <AlertTriangle className="w-4 h-4" /> Needs Improvement
                    </button>
                </div>
            </div>

            {/* Evidence Upload Area */}
            <div className="mb-8">
                <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                    Evidence Upload
                </label>
                <div className="flex items-center gap-3 mb-3">
                    <label className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-slate-300/10 border border-[var(--border-color)] px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-primary)] cursor-pointer transition-colors">
                        <FileUp className="w-4 h-4" />
                        Attach PDF/File
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                    <button 
                        onClick={handleAddLink}
                        className="flex items-center gap-2 bg-[var(--bg-secondary)] hover:bg-slate-300/10 border border-[var(--border-color)] px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-primary)] transition-colors"
                    >
                        <LinkIcon className="w-4 h-4" />
                        Add Link
                    </button>
                </div>
                
                {/* Evidence List */}
                {evidence.length > 0 && (
                    <div className="space-y-2 mt-4">
                        {evidence.map(ev => (
                            <div key={ev.id} className="flex justify-between items-center bg-[var(--bg-secondary)] border border-[var(--border-color)] px-4 py-2 rounded-lg text-sm text-[var(--text-primary)]">
                                <div className="flex items-center gap-2">
                                    {ev.type === 'link' ? <LinkIcon className="w-4 h-4 text-blue-400" /> : <FileUp className="w-4 h-4 text-purple-400" />}
                                    <span className="truncate max-w-sm">{ev.name}</span>
                                </div>
                                <button onClick={() => removeEvidence(ev.id)} className="text-red-400 hover:text-red-300 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center mt-auto border-t border-[var(--border-color)] pt-6">
                <p className="text-xs text-[var(--text-secondary)] italic">
                    Drafts save your progress locally. Final submissions lock the record.
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={handleSaveDraft}
                        disabled={isDrafting || isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {isDrafting ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button 
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting || isDrafting}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-4 h-4" />
                        {isSubmitting ? 'Submitting...' : 'Final Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerAppraisalForm;
