import React from 'react';
import { useSelector } from 'react-redux';
import AdminDashboard from './dashboards/AdminDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (user?.role === 'Super Admin' || user?.role === 'HR' || user?.role === 'Manager') {
        return <AdminDashboard />;
    }

    return <EmployeeDashboard />;
};

export default Dashboard;
