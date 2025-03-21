import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminProfile from './pages/AdminProfile';
import FacultyProfile from './pages/FacultyProfile';
import Dashboard from './pages/Dashboard';
import InputForm from './pages/StudentInput';
import COInputPage from './pages/COInputPage';
import UGPage from './pages/UGPage';
import PGPage from './pages/PGPage';
import AdminDashboard from './pages/AdminDashboard';
import MTechPage from './pages/MTechPage';
import MCARegularPage from './pages/MCARegularPage';
import MCASelfSupportPage from './pages/MCASelfSupportPage';
import CODataDisplayPage from './pages/CODataDisplayPage';
import AllCOData from "./pages/AllCOData"; 
import SplitingMarks from './pages/SplitingMarks';
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserChange = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } else {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}-profile`} replace /> : <Navigate to="/login" replace />} />
      <Route path="/signup" element={<Signup onSignupSuccess={handleUserChange} />} />
      <Route path="/login" element={<Login onLoginSuccess={handleUserChange} />} />
      <Route path="/admin-profile" element={user?.role === 'admin' ? <AdminProfile user={user} setUser={handleUserChange} /> : <Navigate to="/login" replace />} />
      <Route path="/admindashboard" element={<AdminDashboard/>} />
      <Route path="/ug" element={<UGPage />} />
      <Route path="/pg" element={<PGPage />} />
      <Route path="/mtech" component={MTechPage} />
      <Route path="/mca/regular" component={MCARegularPage} />
      <Route path="/mca/self-support" element={<MCASelfSupportPage />} />
      <Route path="/faculty-profile" element={user?.role === 'faculty' ? <FacultyProfile user={user} setUser={handleUserChange} /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/InputForm" element={<InputForm />} />
      <Route path="/co-input" element={<COInputPage />} />
      <Route path="/co-data-display" element={<CODataDisplayPage />} />
      <Route path="/all-co-data" element={<AllCOData/>} />
      <Route path="/spliting-marks" element={<SplitingMarks />} /> 
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
