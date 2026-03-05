import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
    Plus, Search, Clock, AlertCircle,
    CheckCircle2, MessageSquare, Paperclip, MoreHorizontal
} from 'lucide-react';
import Modal from '../../components/Modal';
import CreateTaskForm from './CreateTaskForm';

const TaskBoard = () => {
    const { user } = useSelector((state) => state.auth);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/tasks/my', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'In Progress': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
            case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'Urgent': return <AlertCircle className="w-4 h-4 text-red-500" />;
            case 'High': return <Clock className="w-4 h-4 text-orange-500" />;
            default: return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Work Management</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Track and manage project tasks and assignments.</p>
                </div>
                {(user.role === 'Super Admin' || user.role === 'HR' || user.role === 'Manager') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
                    >
                        <Plus className="w-5 h-5" />
                        Create Task
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Kanban Columns concept or List */}
                {['Open', 'In Progress', 'Completed'].map((column) => (
                    <div key={column} className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-semibold text-[var(--text-secondary)] flex items-center gap-2 uppercase tracking-widest text-xs">
                                {column}
                                <span className="bg-[var(--card-bg)] text-[var(--text-secondary)] px-2 py-0.5 rounded-md text-[10px] border border-[var(--border-color)]">
                                    {tasks.filter(t => t.status === column).length}
                                </span>
                            </h3>
                        </div>

                        <div className="space-y-4 min-h-[500px] bg-[var(--bg-secondary)] p-3 rounded-2xl border border-dashed border-[var(--border-color)] transition-colors">
                            {loading ? (
                                <div className="p-8 text-center text-[var(--text-secondary)] italic">Loading tasks...</div>
                            ) : tasks.filter(t => t.status === column).length === 0 ? (
                                <div className="p-8 text-center text-[var(--text-secondary)] italic text-sm">No tasks in this stage.</div>
                            ) : (
                                tasks.filter(t => t.status === column).map((task) => (
                                    <div
                                        key={task.id}
                                        className="bg-[var(--card-bg)] border border-[var(--border-color)] p-5 rounded-2xl shadow-lg hover:border-blue-500/30 transition-all group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getStatusColor(task.status)} uppercase`}>
                                                {task.priority}
                                            </span>
                                            <button className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <h4 className="text-[var(--text-primary)] font-semibold leading-tight group-hover:text-blue-400 transition-colors">
                                            {task.title}
                                        </h4>
                                        <p className="text-[var(--text-secondary)] text-xs mt-2 line-clamp-2">
                                            {task.description}
                                        </p>

                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="flex -space-x-2">
                                                {task.TaskAssignments?.slice(0, 3).map((asg, i) => (
                                                    <div key={i} title={asg.Employee?.firstName} className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--card-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                                                        {asg.Employee?.firstName?.[0] || '?'}
                                                    </div>
                                                ))}
                                                {task.TaskAssignments?.length > 3 && (
                                                    <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--card-bg)] flex items-center justify-center text-[10px] font-bold text-[var(--text-secondary)]">
                                                        +{task.TaskAssignments.length - 3}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    <MessageSquare className="w-3 h-3" />
                                                    <span>4</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px]">
                                                    <Paperclip className="w-3 h-3" />
                                                    <span>2</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)] font-medium">
                                                <Clock className="w-3 h-3" />
                                                <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                                            </div>
                                            <select
                                                className="bg-transparent text-[10px] text-blue-400 font-bold focus:outline-none"
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">Move to Progress</option>
                                                <option value="Completed">Mark Completed</option>
                                            </select>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Assign New Task">
                <CreateTaskForm
                    onSuccess={() => {
                        setIsModalOpen(false);
                        fetchTasks();
                    }}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default TaskBoard;
