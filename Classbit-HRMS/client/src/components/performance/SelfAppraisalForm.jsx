import React, { useState } from 'react';
import { PenTool, Save, Eye } from 'lucide-react';

const SelfAppraisalForm = ({ initialData, onSubmit }) => {
    const [text, setText] = useState(initialData?.selfAppraisalText || '');
    const [agreed, setAgreed] = useState(initialData?.employeeAgreed || false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (onSubmit) {
            await onSubmit({ selfAppraisalText: text, employeeAgreed: agreed });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] p-6 rounded-2xl shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">Self Appraisal</h3>
                </div>
                {agreed && (
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Submitted
                    </span>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                <div className="flex-1 min-h-[150px] mb-4">
                    <label className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 ml-1">
                        Reflect on your achievements, challenges, and goals for this cycle:
                    </label>
                    <textarea 
                        className="w-full h-[200px] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-4 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none custom-scrollbar"
                        placeholder="I led the backend refactor which improved latency by 20%..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={agreed}
                        required
                    />
                </div>

                <div className="flex items-center gap-3 mb-6 bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl">
                    <input 
                        type="checkbox" 
                        id="agreeBox" 
                        className="w-4 h-4 rounded bg-[var(--bg-secondary)] border-[var(--border-color)] text-blue-500 focus:ring-blue-500/50" 
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        disabled={agreed}
                    />
                    <label htmlFor="agreeBox" className="text-sm text-[var(--text-primary)] cursor-pointer">
                        I confirm this self-appraisal and am ready to submit it for manager review. (Cannot be undone)
                    </label>
                </div>

                <button 
                    type="submit"
                    disabled={isSubmitting || agreed || text.trim() === ''}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-lg"
                >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Save & Submit'}
                </button>
            </form>
        </div>
    );
};

export default SelfAppraisalForm;
