import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import './DashboardStyles.css';

const AdminProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [departmentDropdown, setDepartmentDropdown] = useState(false);
  const [levelDropdown, setLevelDropdown] = useState(false);

  const handleLogout = () => {
    logoutUser(); // Call API logout (if needed)
    localStorage.removeItem('user'); // Remove stored user session
    setUser(null); // Update state
    navigate('/login'); // Redirect to login page
  };

  const toggleDepartmentDropdown = () => setDepartmentDropdown(!departmentDropdown);

  const toggleLevelDropdown = () => setLevelDropdown(!levelDropdown);

  const handleRedirect = (path) => {
    navigate(path);
  };

  return (
    <div className="admin-profile">
        <div className="admin-header">
          <h1 className="admin-site-title">Academic Outcome Analysis</h1>
        </div>
      <div className="admin-sidebar">
        <button onClick={() => handleRedirect('/admindashboard')} className="sidebar-button">Dashboard</button>
        <div className="admin-sidebar-button" onClick={toggleDepartmentDropdown}>
          Department
        </div>
        {departmentDropdown && (
          <div className="dropdown">
            <div onClick={toggleLevelDropdown} className="dropdown-item">IST</div>
            <div className="dropdown-item">Others</div>
            {levelDropdown && (
              <div className="level-dropdown">
                <div onClick={() => handleRedirect('/ug')} className="dropdown-item">UG</div>
                <div onClick={() => handleRedirect('/pg')} className="dropdown-item">PG</div>
              </div>
            )}
          </div>
        )}

        <button onClick={handleLogout} className="sidebar-button logout-button">Logout</button>
      </div>
    </div>
  );
};

export default AdminProfile;
