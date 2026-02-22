import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NurseDashboard from './pages/NurseDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PatientDetails from './pages/PatientDetails';

const Loader = () => (
  <div style={{
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }}>
    <div style={{
      width: 56, height: 56,
      background: 'linear-gradient(135deg,#4f8ef7,#22d3ee)',
      borderRadius: 16,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 28,
    }}>🩹</div>
    <div className="spinner" style={{ width: 28, height: 28 }}></div>
    <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading pH Bandage...</div>
  </div>
);

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth();
  if (loading) return <Loader />;
  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole)
    return <Navigate to={`/${user?.role}-dashboard`} replace />;
  return children;
};

function App() {
  const { user, token, loading } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/nurse-dashboard" element={
          <ProtectedRoute requiredRole="nurse"><NurseDashboard /></ProtectedRoute>
        } />
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute requiredRole="doctor"><DoctorDashboard /></ProtectedRoute>
        } />
        <Route path="/patient/:patientId" element={
          <ProtectedRoute requiredRole="doctor"><PatientDetails /></ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/" element={
          loading ? <Loader /> :
            token ? <Navigate to={`/${user?.role}-dashboard`} replace /> :
              <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;
