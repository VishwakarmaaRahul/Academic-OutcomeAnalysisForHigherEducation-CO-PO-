import React from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardStyles.css"; // Ensure you have this CSS file for styling

const Dashboard = () => {
  const navigate = useNavigate();

  // Function to navigate back to the faculty profile
  const goToProfile = () => {
    navigate("/faculty-profile"); // Ensure this route exists in your router
  };

  const goToSplitingPage = () => {
    navigate("/spliting-marks");
  }

  return (
    <div className="dashboard-container">
      {/* Navigation Buttons */}
      <div className="dashboard-menu-container">
        <button className="dashboard-button">Profile</button>
        <button className="dashboard-button" onClick={goToSplitingPage}>Program</button>
        <button className="dashboard-button" onClick={goToProfile}>
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
