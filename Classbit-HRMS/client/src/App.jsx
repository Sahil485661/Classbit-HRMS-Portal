import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import CalendarPage from './pages/calendar/CalendarPage';
import ForceChangePassword from './pages/ForceChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeHistory from './pages/employees/EmployeeHistory';
import AddEmployeePage from './pages/employees/AddEmployeePage';
import EmployeeDetailsPage from './pages/employees/EmployeeDetailsPage';
import AttendancePage from './pages/attendance/AttendancePage';
import TaskBoard from './pages/work/TaskBoard';
import TaskDetailsPage from './pages/work/TaskDetailsPage';
import PayrollPage from './pages/payroll/PayrollPage';
import LeaveManagement from './pages/leave/LeaveManagement';
import SettingsPage from './pages/setup/SettingsPage';
import LoanPage from './pages/loan/LoanPage';
import GrievancePage from './pages/grievance/GrievancePage';
import MessagesPage from './pages/messages/MessagesPage';
import AccountingPage from './pages/accounting/AccountingPage';
import ReportsPage from './pages/reports/ReportsPage';
import ActivitiesPage from './pages/activities/ActivitiesPage';
import ReimbursementPage from './pages/reimbursements/ReimbursementPage';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red', background: 'white' }}>
          <h2>Something went wrong in the UI.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button onClick={() => window.location.href='/employees'}>Go Back</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const PrivateRoute = ({ children, roles, permissionKey }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;
  
  if (user.role === 'Super Admin') return <ErrorBoundary>{children}</ErrorBoundary>;

  const perms = user.permissions;

  // Fallback to legacy role checks if permissions are unassigned or undefined
  if (perms === undefined || perms.length === 0) {
      if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;
      return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  if (permissionKey) {
      if (!perms.includes(permissionKey)) return <Navigate to="/dashboard" />;
  } else if (roles && !roles.includes(user.role)) {
      return <Navigate to="/dashboard" />;
  }

  return <ErrorBoundary>{children}</ErrorBoundary>;
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
          <Route path="/force-change-password" element={<ForceChangePassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<ResetPassword />} />

          <Route path="/" element={<Navigate to="/dashboard" />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <AppLayout><Dashboard /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/calendar" element={
            <PrivateRoute>
              <AppLayout><CalendarPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees" element={
            <PrivateRoute permissionKey="Employees">
              <AppLayout><EmployeeList /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees/history" element={
            <PrivateRoute permissionKey="Employees">
              <AppLayout><EmployeeHistory /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees/:id" element={
            <PrivateRoute permissionKey="Employees">
              <AppLayout><EmployeeDetailsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees/add" element={
            <PrivateRoute permissionKey="Employees">
              <AppLayout><AddEmployeePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees/edit/:id" element={
            <PrivateRoute permissionKey="Employees">
              <AppLayout><AddEmployeePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/attendance" element={
            <PrivateRoute permissionKey="Attendance">
              <AppLayout><AttendancePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/work" element={
            <PrivateRoute permissionKey="Tasks">
              <AppLayout><TaskBoard /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/work/tasks/:id" element={
            <PrivateRoute permissionKey="Tasks">
              <AppLayout><TaskDetailsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/payroll" element={
            <PrivateRoute permissionKey="Payroll">
              <AppLayout><PayrollPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/leave" element={
            <PrivateRoute permissionKey="Leaves">
              <AppLayout><LeaveManagement /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/setup" element={
            <PrivateRoute permissionKey="Settings">
              <AppLayout><SettingsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/loan" element={
            <PrivateRoute permissionKey="Loans">
              <AppLayout><LoanPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/grievance" element={
            <PrivateRoute permissionKey="Grievances">
              <AppLayout><GrievancePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/messages" element={
            <PrivateRoute permissionKey="Messages">
              <AppLayout><MessagesPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/reimbursements" element={
            <PrivateRoute permissionKey="Reimbursements">
              <AppLayout><ReimbursementPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/accounting" element={
            <PrivateRoute permissionKey="Accounting">
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
