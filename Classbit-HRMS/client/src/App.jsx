import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ThemeToggle from './components/ThemeToggle';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import AddEmployeePage from './pages/employees/AddEmployeePage';
import EmployeeDetailsPage from './pages/employees/EmployeeDetailsPage';
import AttendancePage from './pages/attendance/AttendancePage';
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

const PrivateRoute = ({ children, roles }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return <ErrorBoundary>{children}</ErrorBoundary>;
};

const AppLayout = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden transition-colors duration-300">
      <ThemeToggle />
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

          <Route path="/employees/:id" element={
            <PrivateRoute roles={['Super Admin', 'HR', 'Manager']}>
              <AppLayout><EmployeeDetailsPage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees/add" element={
            <PrivateRoute roles={['Super Admin', 'HR', 'Manager']}>
              <AppLayout><AddEmployeePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/employees/edit/:id" element={
            <PrivateRoute roles={['Super Admin', 'HR', 'Manager']}>
              <AppLayout><AddEmployeePage /></AppLayout>
            </PrivateRoute>
          } />

          <Route path="/attendance" element={
            <PrivateRoute>
              <AppLayout><AttendancePage /></AppLayout>
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
            <PrivateRoute roles={['Super Admin', 'HR']}>
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
