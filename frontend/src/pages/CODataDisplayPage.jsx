import React, { useState, useEffect } from 'react';
import './DashboardStyles.css'; // Import your existing CSS file

const CODataDisplayPage = () => {
    const [coData, setCoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State variables to control visibility of each section
    const [showFormData, setShowFormData] = useState(false);
    const [showStudents, setShowStudents] = useState(false);
    const [showCOWiseMarks, setShowCOWiseMarks] = useState(false);
    const [showWeightedAveragePercentage, setShowWeightedAveragePercentage] = useState(false);

    // Define the redirectToLogin function
    const redirectToLogin = () => {
        navigate('/login'); // Redirect to the login page
    };

    // Fetch all CO data from the backend
    const fetchAllCOData = async () => {
        try {
            const token = localStorage.getItem('token');
    
            const response = await fetch('http://127.0.0.1:5000/auth/get-all-co-data', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 401) {
                const errorText = await response.text();
                if (errorText.includes("Token has expired")) {
                    console.log("Token expired. Redirecting to login...");
                    redirectToLogin(); // Redirect to the login page
                    return;
                }
            }
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server response:", errorText);
                throw new Error('Failed to fetch CO data');
            }
    
            const result = await response.json();
            setCoData(result.data); // Set the fetched data to state
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    // Fetch data when the component mounts
    useEffect(() => {
        fetchAllCOData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    
    return (
        <div className="container-co">
            {/* Sidebar */}
            <div className="sidebar-co">
                <button className="sidebar-button-co" onClick={() => setShowFormData(!showFormData)}>
                    {showFormData ? "Hide Form Data" : "Form Data"}
                </button>
                <button className="sidebar-button-co" onClick={() => setShowStudents(!showStudents)}>
                    {showStudents ? "Hide Students" : "Students"}
                </button>
                <button className="sidebar-button-co" onClick={() => setShowCOWiseMarks(!showCOWiseMarks)}>
                    {showCOWiseMarks ? "Hide CO-wise Marks" : "CO-wise Marks"}
                </button>
                <button className="sidebar-button-co" onClick={() => setShowWeightedAveragePercentage(!showWeightedAveragePercentage)}>
                    {showWeightedAveragePercentage ? "Hide CO Average Percentage" : "CO Average Percentage"}
                </button>
            </div>

            {/* Content Area */}
            <div className="content-co">
                <h2>All CO Data</h2>

                {/* Display CO Data */}
                {coData.length > 0 ? (
                    <div>
                        {coData.map((data, index) => (
                            <div key={index} className="co-data-entry">
                                <h3>CO Data Entry #{index + 1}</h3>

                                {/* Form Data Section */}
                                {showFormData && (
                                    <>
                                        <h4>Form Data:</h4>
                                        <ul>
                                            {Object.entries(data.formData).map(([key, value]) => (
                                                <li key={key}><strong>{key}:</strong> {value}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {/* Students Section */}
                                {showStudents && (
                                    <>
                                        <h4>Students:</h4>
                                        <table border="1">
                                            <thead>
                                                <tr>
                                                    <th>S No</th>
                                                    <th>Registration No</th>
                                                    <th>Marks</th>
                                                    <th>Activities</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.students.map((student, idx) => (
                                                    <tr key={idx}>
                                                        <td>{student.SNo}</td>
                                                        <td>{student.RegNo}</td>
                                                        <td>{student.Marks.join(', ')}</td>
                                                        <td>{student.Activities.join(', ')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                                {/* CO-wise Marks Section */}
                                {showCOWiseMarks && (
                                    <>
                                        <h4>CO-wise Marks:</h4>
                                        <ul>
                                            {Object.entries(data.coWiseMarks).map(([co, marks]) => (
                                                <li key={co}><strong>{co}:</strong> {JSON.stringify(marks)}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {/* Weighted Average Percentage Section */}
                                {showWeightedAveragePercentage && (
                                    <>
                                        <h4>CO Average Percentage:</h4>
                                        <ul>
                                            {Object.entries(data.weightedAveragePercentage).map(([co, percentage]) => (
                                                <li key={co}><strong>{co}:</strong> {percentage.toFixed(2)}%</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>No CO data found.</div>
                )}
            </div>
        </div>
    );
};

export default CODataDisplayPage;