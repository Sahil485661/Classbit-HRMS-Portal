import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    LogOut, Bell, Search, User, X, Mail, Phone,
    Briefcase, Building2, CreditCard, IndianRupee, Shield,
    MapPin, Calendar, Heart, Flag, MessageCircle, ChevronRight,
    TrendingUp, TrendingDown, FileText, Database
} from 'lucide-react';
import NotificationHub from './NotificationHub';

const API = 'http://localhost:5000/api';

// Helper: format Indian currency
const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—';

// ── Info Row for the panel ────────────────────────
const Row = ({ icon: Icon, label, value, color = 'text-blue-500' }) => (
    value ? (
        <div className="flex items-start gap-3 py-2.5 border-b border-[var(--border-color)] last:border-0">
            <div className={`mt-0.5 shrink-0 ${color}`}><Icon className="w-4 h-4" /></div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">{label}</p>
                <p className="text-sm text-[var(--text-primary)] font-medium mt-0.5 break-words">{value}</p>
            </div>
        </div>
    ) : null
);

// ── Profile Side Panel ────────────────────────────
const ProfilePanel = ({ isOpen, onClose }) => {
    const { user } = useSelector((s) => s.auth);
    const [profile, setProfile]     = useState(null);
    const [salary,  setSalary]      = useState(null);
    const [payslips, setPayslips]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [tab, setTab]             = useState('profile'); // 'profile' | 'salary' | 'payslips'

    const token   = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);

        Promise.allSettled([
            // fetch profile: use employeeId UUID if available, else skip
            user?.employeeId
                ? axios.get(`${API}/employees/${user.employeeId}`, { headers })
                : Promise.reject('no employeeId'),
            // use dedicated /my endpoint — always works for any logged-in user
            axios.get(`${API}/salary/my`, { headers }),
            axios.get(`${API}/payroll/my`, { headers })
        ]).then(([empRes, salRes, payRes]) => {
            if (empRes.status === 'fulfilled') setProfile(empRes.value.data);
            if (salRes.status === 'fulfilled') setSalary(salRes.value.data);
            if (payRes.status === 'fulfilled') setPayslips(Array.isArray(payRes.value.data) ? payRes.value.data.slice(0, 6) : []);
        }).finally(() => setLoading(false));
    }, [isOpen]);

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={onClose} />

            {/* Drawer */}
            <div className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[var(--card-bg)] border-l border-[var(--border-color)] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="relative px-6 pt-8 pb-6 bg-slate-900 text-white shrink-0">
                    <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl border-2 border-white/30 overflow-hidden shadow-xl shrink-0">
                            {profile?.profilePicture ? (
                                <img src={`http://localhost:5000/uploads/${profile.profilePicture}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-blue-100 text-sm mt-0.5">{profile?.designation || user?.role}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-white/15 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{user?.role}</span>
                                <span className="bg-white/15 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{profile?.employeeId || '—'}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${profile?.status === 'Active' ? 'bg-green-400/30 text-green-100' : 'bg-red-400/30 text-red-100'}`}>
                                    {profile?.status || '—'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-[var(--border-color)] shrink-0 bg-[var(--card-bg)]">
                    {[
                        { id: 'profile', label: 'Profile' },
                        { id: 'salary', label: 'Salary' },
                        { id: 'payslips', label: 'Payslips' }
                    ].map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                                tab === t.id
                                    ? 'text-blue-500 border-b-2 border-blue-500'
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3">
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm text-[var(--text-secondary)]">Loading your profile…</p>
                        </div>
                    ) : (

                        /* ── PROFILE TAB ── */
                        tab === 'profile' && (
                            <div className="space-y-5">
                                {/* Contact */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <MessageCircle className="w-3.5 h-3.5" /> Contact
                                    </h3>
                                    <Row icon={Mail}   label="Email"        value={profile?.User?.email} />
                                    <Row icon={Phone}  label="Phone"        value={profile?.phone} />
                                    <Row icon={Phone}  label="WhatsApp"     value={profile?.whatsappNumber} color="text-green-500" />
                                    <Row icon={MapPin} label="Address"      value={profile?.address} color="text-amber-500" />
                                </section>

                                {/* Work */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <Briefcase className="w-3.5 h-3.5" /> Employment
                                    </h3>
                                    <Row icon={Briefcase}  label="Designation"  value={profile?.designation} />
                                    <Row icon={Building2}  label="Department"   value={profile?.Department?.name} color="text-purple-500" />
                                    <Row icon={Calendar}   label="Joined"       value={profile?.joiningDate} color="text-teal-500" />
                                </section>

                                {/* Personal */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <User className="w-3.5 h-3.5" /> Personal
                                    </h3>
                                    <Row icon={Calendar} label="Date of Birth"  value={profile?.dob} color="text-pink-500" />
                                    <Row icon={Heart}    label="Marital Status" value={profile?.maritalStatus} color="text-red-500" />
                                    <Row icon={Flag}     label="Nationality"    value={profile?.nationality} color="text-orange-500" />
                                    <Row icon={FileText} label={`${profile?.identityType || 'Aadhar'} No.`} value={profile?.identityNumber} color="text-slate-400" />
                                </section>

                                {/* Bank */}
                                <section>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                        <CreditCard className="w-3.5 h-3.5" /> Bank Details
                                    </h3>
                                    <Row icon={Database}  label="Bank Name"        value={profile?.bankName} color="text-indigo-500" />
                                    <Row icon={User}      label="Account Holder"   value={profile?.accountHolderName} />
                                    <Row icon={CreditCard} label="Account Number"  value={profile?.bankAccountNumber} color="text-blue-400" />
                                    <Row icon={FileText}  label="IFSC Code"        value={profile?.bankIfscCode} color="text-cyan-500" />
                                    <Row icon={Shield}    label="UPI ID"           value={profile?.upiId} color="text-violet-500" />
                                </section>

                                {/* Emergency */}
                                {(profile?.emergencyContactName || profile?.emergencyContact) && (
                                    <section>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5" /> Emergency Contact
                                        </h3>
                                        <Row icon={User}  label="Name"  value={profile?.emergencyContactName} color="text-red-500" />
                                        <Row icon={Phone} label="Phone" value={profile?.emergencyContact} color="text-red-500" />
                                    </section>
                                )}
                            </div>
                        )
                    )}

                    {/* ── SALARY TAB ── */}
                    {!loading && tab === 'salary' && (() => {
                        // MySQL sometimes returns JSON columns as raw strings — parse defensively
                        const parseJSON = (v) => {
                            if (!v) return {};
                            if (typeof v === 'object') return v;
                            try { return JSON.parse(v); } catch { return {}; }
                        };
                        const allowances = parseJSON(salary?.allowances);
                        const deductions = parseJSON(salary?.deductions);
                        const allowTotal = Object.values(allowances).reduce((s, v) => s + (parseFloat(v) || 0), 0);
                        const deductTotal = Object.values(deductions).reduce((s, v) => s + (parseFloat(v) || 0), 0);
                        const grossSalary = (parseFloat(salary?.baseSalary) || 0) + allowTotal;
                        const netSalary = Math.max(0, grossSalary - deductTotal);

                        return (
                        <div className="space-y-4">
                            {!salary ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <IndianRupee className="w-10 h-10 text-slate-400/30 mb-3" />
                                    <p className="text-sm font-bold text-[var(--text-primary)]">No Salary Structure Set</p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Your HR has not configured your salary components yet.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary cards */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2 p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white text-center shadow-lg">
                                            <p className="text-[9px] font-bold uppercase tracking-wider opacity-75">Gross Salary</p>
                                            <p className="text-2xl font-extrabold mt-1">{fmt(grossSalary)}</p>
                                            <p className="text-[10px] opacity-60 mt-1">{salary.payType} · {salary.currency}</p>
                                        </div>
                                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Base Pay</p>
                                            <p className="text-base font-extrabold text-emerald-500 mt-1">{fmt(salary.baseSalary)}</p>
                                        </div>
                                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">Allowances</p>
                                            <p className="text-base font-extrabold text-green-500 mt-1">+{fmt(allowTotal)}</p>
                                        </div>
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-red-500">Deductions</p>
                                            <p className="text-base font-extrabold text-red-500 mt-1">-{fmt(deductTotal)}</p>
                                        </div>
                                        <div className="p-3 bg-slate-500/10 border border-[var(--border-color)] rounded-xl text-center">
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">Est. Net Pay</p>
                                            <p className="text-base font-extrabold text-[var(--text-primary)] mt-1">{fmt(netSalary)}</p>
                                        </div>
                                    </div>

                                    {/* Allowances breakdown */}
                                    {Object.keys(allowances).length > 0 && (
                                        <div className="rounded-2xl overflow-hidden border border-emerald-500/20 bg-emerald-500/5">
                                            <div className="px-4 py-2.5 border-b border-emerald-500/20 flex items-center gap-1.5">
                                                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Allowances</p>
                                            </div>
                                            <div className="p-4 space-y-2.5">
                                                {Object.entries(allowances).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between items-center text-sm">
                                                        <span className="text-[var(--text-secondary)]">{k}</span>
                                                        <span className="font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">+{fmt(v)}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center text-sm font-bold border-t border-emerald-500/20 pt-2 mt-1">
                                                    <span className="text-[var(--text-secondary)] uppercase text-[10px]">Total</span>
                                                    <span className="text-emerald-500">{fmt(allowTotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Deductions breakdown */}
                                    {Object.keys(deductions).length > 0 && (
                                        <div className="rounded-2xl overflow-hidden border border-red-500/20 bg-red-500/5">
                                            <div className="px-4 py-2.5 border-b border-red-500/20 flex items-center gap-1.5">
                                                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                                                <p className="text-[10px] font-black text-red-500 uppercase tracking-wider">Deductions</p>
                                            </div>
                                            <div className="p-4 space-y-2.5">
                                                {Object.entries(deductions).map(([k, v]) => (
                                                    <div key={k} className="flex justify-between items-center text-sm">
                                                        <span className="text-[var(--text-secondary)]">{k}</span>
                                                        <span className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-md">-{fmt(v)}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between items-center text-sm font-bold border-t border-red-500/20 pt-2 mt-1">
                                                    <span className="text-[var(--text-secondary)] uppercase text-[10px]">Total</span>
                                                    <span className="text-red-500">-{fmt(deductTotal)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {Object.keys(allowances).length === 0 && Object.keys(deductions).length === 0 && (
                                        <p className="text-xs text-[var(--text-secondary)] italic text-center py-4">Only base salary is configured. No allowances or deductions added yet.</p>
                                    )}
                                </>
                            )}
                        </div>
                        );
                    })()}


                    {/* ── PAYSLIPS TAB ── */}
                    {!loading && tab === 'payslips' && (
                        <div className="space-y-3">
                            {payslips.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 text-center">
                                    <FileText className="w-10 h-10 text-slate-400/30 mb-3" />
                                    <p className="text-sm font-bold text-[var(--text-primary)]">No Payslips Yet</p>
                                    <p className="text-xs text-[var(--text-secondary)] mt-1">Your salary records will appear here once payroll is processed.</p>
                                </div>
                            ) : payslips.map(p => (
                                <div key={p.id} className="px-4 py-3 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] hover:border-blue-500/30 transition-all">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-[var(--text-primary)]">{MONTHS[(p.month||1)-1]} {p.year}</p>
                                            <p className="text-xs text-emerald-500 font-bold mt-0.5">{fmt(p.netSalary)} net</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                                p.status === 'Paid'     ? 'bg-green-500/10 text-green-500' :
                                                p.status === 'Approved' ? 'bg-purple-500/10 text-purple-500' :
                                                p.status === 'Verified' ? 'bg-blue-500/10 text-blue-500' :
                                                                          'bg-amber-500/10 text-amber-500'
                                            }`}>{p.status}</span>
                                            <p className="text-[10px] text-[var(--text-secondary)] mt-1">-{fmt(p.totalDeductions)} ded.</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-[var(--border-color)] shrink-0 bg-[var(--card-bg)]">
                    <p className="text-[10px] text-[var(--text-secondary)] text-center">
                        Last login: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'This session'}
                    </p>
                </div>
            </div>
        </>
    );
};

// ── Navbar ────────────────────────────────────────
const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <>
            <header className="h-16 bg-[var(--card-bg)] backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-end px-8 sticky top-0 z-10 transition-colors">                <div className="flex items-center gap-6">
                    <NotificationHub />

                    <div className="h-8 w-[1px] bg-[var(--border-color)]" />

                    {/* Profile — clickable */}
                    <button
                        onClick={() => setProfileOpen(true)}
                        className="flex items-center gap-3 group cursor-pointer hover:opacity-90 transition-opacity"
                        title="View My Profile"
                    >
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-[var(--text-secondary)]">{user?.role}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ring-2 shadow-lg transition-all overflow-hidden ${profileOpen ? 'bg-blue-700 ring-blue-500' : 'bg-slate-700 ring-[var(--border-color)] group-hover:bg-blue-600 group-hover:ring-blue-400'}`}>
                            {user?.profilePicture && user.profilePicture !== 'null' ? (
                                <img src={user.profilePicture.startsWith('http') ? user.profilePicture : `http://localhost:5000/uploads/${user.profilePicture}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-5 h-5" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="ml-2 p-2 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>

            <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </>
    );
};

export default Navbar;
