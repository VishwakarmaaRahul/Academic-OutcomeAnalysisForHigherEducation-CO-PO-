import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";
import "./DashboardStyles.css";

const FacultyProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("B.Tech");

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const goToDashboard = () => {
    navigate("/dashboard"); // Navigate to Dashboard page
  };

  const goToInput = () => {
    navigate("/InputForm");
  };

  return (
    <>
          <div className="sidebar-profile">
            <button onClick={goToDashboard} className="sidebar-button-faculty">
              Dashboard
            </button>
            <button onClick={goToInput} className="sidebar-button-faculty">
              Course Input
            </button>
            <button onClick={handleLogout} className="sidebar-button-faculty">
              Logout
            </button>
          </div>
    
      <div className="content">
        {/* Page content goes here */}
        <h1>Academic Outcome Analysis</h1>
      </div>

    </>
  );
};

export default FacultyProfile;
