import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Target, Download } from 'lucide-react';
import KPIWidgets from '../../components/performance/KPIWidgets';
import ChartsComponent from '../../components/performance/ChartsComponent';
import OKRList from '../../components/performance/OKRList';
import FeedbackFeed from '../../components/performance/FeedbackFeed';
import NineBoxGrid from '../../components/performance/NineBoxGrid';
import SelfAppraisalForm from '../../components/performance/SelfAppraisalForm';

const PerformancePage = () => {
    const { user } = useSelector((state) => state.auth);
    const isEmployee = user.role === 'Employee';
    
    const [dashboardData, setDashboardData] = useState(null);
    const [allEmployees, setAllEmployees] = useState([]);
    const [employeesOptions, setEmployeesOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (isEmployee) {
                const res = await axios.get('http://localhost:5000/api/performance/dashboard/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDashboardData(res.data);
            } else {
                // HR/Admin view gets all
                const res = await axios.get('http://localhost:5000/api/performance/dashboard/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllEmployees(res.data);
                
                // For their own personal view if they have one, or just empty
                const myRes = await axios.get('http://localhost:5000/api/performance/dashboard/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDashboardData(myRes.data);
            }
        } catch (error) {
            console.error('Error fetching performance:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployeesOptions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/employees', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEmployeesOptions(res.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    useEffect(() => {
        fetchDashboard();
        fetchEmployeesOptions();
    }, [user.role]);

    const handleFeedbackSubmit = async (feedbackData) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/performance/feedback', feedbackData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Feedback submitted successfully!');
            fetchDashboard(); // Refresh feed
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Failed to submit feedback.');
        }
    };

    const handleSelfAppraisalSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/performance/appraisal/self`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDashboard();
        } catch (error) {
            console.error('Error submitting self appraisal:', error);
            alert('Failed to submit appraisal.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Performance Dashboard</h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        {isEmployee ? 'Track your growth, objectives, and appraisals.' : 'Monitor organization performance metrics.'}
                    </p>
                </div>
                {!isEmployee && (
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-900/20">
                        <Download className="w-4 h-4" />
                        Export Metrics
                    </button>
                )}
            </div>

            {/* KPI Sparklines Row */}
            <KPIWidgets data={dashboardData || {}} />

            {/* Main 12-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Visual Charts spanning 8 columns */}
                <div className="lg:col-span-8 space-y-6">
                    <ChartsComponent performanceData={dashboardData || {}} />
                </div>

                {/* OKRs spanning 4 columns */}
                <div className="lg:col-span-4 h-full">
                    <OKRList 
                        okrs={dashboardData?.okrs || []} 
                        isEmployee={isEmployee} 
                        onAddOkr={() => alert('Add OKR modal pending')} 
                    />
                </div>

                {/* Feedback Feed spanning 6 columns */}
                <div className="lg:col-span-6 h-[500px]">
                    <FeedbackFeed 
                        feedbacks={dashboardData?.feedbacks || []} 
                        employeesList={employeesOptions}
                        onSubmit={handleFeedbackSubmit}
                        currentUserId={user.id}
                    />
                </div>

                {/* Conditional Panel spanning 6 columns */}
                <div className="lg:col-span-6 h-[500px]">
                    {isEmployee ? (
                        <SelfAppraisalForm 
                            initialData={dashboardData?.performances?.[0]} 
                            onSubmit={handleSelfAppraisalSubmit} 
                        />
                    ) : (
                        <NineBoxGrid employees={allEmployees} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PerformancePage;
