import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                />

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-900/50">
                        <h3 className="text-xl font-bold text-slate-100 italic tracking-tight">{title}</h3>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-slate-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default Modal;
