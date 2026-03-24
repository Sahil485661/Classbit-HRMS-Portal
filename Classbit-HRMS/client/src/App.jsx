import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import AttendancePage from './pages/attendance/AttendancePage';
import LateComingPage from './pages/attendance/LateComingPage';
import OvertimePage from './pages/attendance/OvertimePage';
import TaskBoard from './pages/work/TaskBoard';
import TaskDetailsPage from './pages/work/TaskDetailsPage';
import PayrollPage from './pages/payroll/PayrollPage';
import LeaveManagement from './pages/leave/LeaveManagement';
import PerformancePage from './pages/performance/PerformancePage';
import SettingsPage from './pages/setup/SettingsPage';
import LoanPage from './pages/loan/LoanPage';
import GrievancePage from './pages/grievance/GrievancePage';
import MessagesPage from './pages/messages/MessagesPage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';
import AccountingPage from './pages/accounting/AccountingPage';
import ReportsPage from './pages/reports/ReportsPage';
import ActivitiesPage from './pages/activities/ActivitiesPage';


const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
};

const AppLayout = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--bg-secondary)] backdrop-blur-sm">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout><Dashboard /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees" element={
            <PrivateRoute roles={['Super Admin', 'HR', 'Manager']}>
              <AppLayout><EmployeeList /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/attendance" element={
            <PrivateRoute>
              <AppLayout><AttendancePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/attendance/late-coming" element={
            <PrivateRoute>
              <AppLayout><LateComingPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/attendance/overtime" element={
            <PrivateRoute>
              <AppLayout><OvertimePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/work" element={
            <PrivateRoute>
              <AppLayout><TaskBoard /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/work/tasks/:id" element={
            <PrivateRoute>
              <AppLayout><TaskDetailsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/payroll" element={
            <PrivateRoute roles={['Super Admin', 'HR', 'Employee']}>
              <AppLayout><PayrollPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/leave" element={
            <PrivateRoute>
              <AppLayout><LeaveManagement /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/performance" element={
            <PrivateRoute>
              <AppLayout><PerformancePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/setup" element={
            <PrivateRoute roles={['Super Admin']}>
              <AppLayout><SettingsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/loan" element={
            <PrivateRoute>
              <AppLayout><LoanPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/grievance" element={
            <PrivateRoute>
              <AppLayout><GrievancePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/messages" element={
            <PrivateRoute>
              <AppLayout><MessagesPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/recruitment" element={
            <PrivateRoute roles={['Super Admin', 'HR']}>
              <AppLayout><RecruitmentPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/accounting" element={
            <PrivateRoute roles={['Super Admin']}>
              <AppLayout><AccountingPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/reports" element={
            <PrivateRoute roles={['Super Admin', 'HR']}>
              <AppLayout><ReportsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/activities" element={
            <PrivateRoute roles={['Super Admin']}>
              <AppLayout><ActivitiesPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/managers" element={
            <PrivateRoute roles={['Super Admin']}>
              <AppLayout><EmployeeList title="Management Hierarchy" /></AppLayout>
            </PrivateRoute>
          } />


        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
