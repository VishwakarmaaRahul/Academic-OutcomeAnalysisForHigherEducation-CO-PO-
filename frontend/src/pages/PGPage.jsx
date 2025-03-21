import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // Already imported
import { useNavigate } from "react-router-dom"; // Already imported
import './DashboardStyles.css'; 

const PGPage = () => {
  const [mcaDropdown, setMcaDropdown] = useState(false);
  const [mtechDropdown, setMtechDropdown] = useState(false);
  const navigate = useNavigate();

  const mcaRef = useRef(null);
  const mtechRef = useRef(null);

  const toggleMcaDropdown = () => setMcaDropdown(!mcaDropdown);
  const toggleMtechDropdown = () => setMtechDropdown(!mtechDropdown);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mcaRef.current && !mcaRef.current.contains(event.target)) {
        setMcaDropdown(false);
      }
      if (mtechRef.current && !mtechRef.current.contains(event.target)) {
        setMtechDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <h2 className="sidebar-title">PG Students Details</h2>
      <div className="pg-sidebar">
        <div className="sidebar-item" ref={mtechRef}>
          <button className="sidebar-btn" onClick={toggleMtechDropdown}>
            M.Tech
          </button>
          {mtechDropdown && (
            <ul className="dropdown-list">
              <li><Link className="dropdown-link" to="/mtech">AI/DS</Link></li>
              <li><Link className="dropdown-link" to="/mtech">Core</Link></li>
            </ul>
          )}
        </div>

        <div className="sidebar-item" ref={mcaRef}>
          <button className="sidebar-btn" onClick={toggleMcaDropdown}>
            MCA
          </button>
          {mcaDropdown && (
            <ul className="dropdown-list">
              <li><Link className="dropdown-link" to="/mca/regular">Regular</Link></li>
              <li><Link className="dropdown-link" to="/mca/self-support">Self Support</Link></li>
            </ul>
          )}
        </div>

        <button className="logout-btn" onClick={() => navigate("/login")}>
          Logout
        </button>
      </div>
    </>
  );
};

export default PGPage;
