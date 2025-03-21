import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AllCOData = () => {
    const [coData, setCOData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch all CO data from the backend
    const fetchCOData = async () => {
        try {
            const response = await fetch("/auth/get-all-co-data", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch CO data");
            }

            const data = await response.json();
            setCOData(data.data); // Set the fetched data
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCOData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>CO Data Display</h2>
            <button onClick={() => navigate(-1)}>Go Back</button>

            {/* Display all formData details */}
            <div style={{ marginBottom: "20px" }}>
                <h3>Form Data Details</h3>
                {coData.map((data, index) => (
                    <div key={index} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
                        <h4>Assessment {index + 1}</h4>
                        <p><strong>Assessment Type:</strong> {data.formData?.Assessment_Type}</p>
                        <p><strong>Batch:</strong> {data.formData?.Batch}</p>
                        <p><strong>Semester:</strong> {data.formData?.Semester}</p>
                        <p><strong>Total Students:</strong> {data.formData?.Total_Students}</p>
                        <p><strong>Expected Threshold:</strong> {data.formData?.Expected_Threshold}%</p>
                        {/* Add more fields as needed */}
                    </div>
                ))}
            </div>

            {/* Display weightedAveragePercentage in a table */}
            <h3>Weighted Average Percentage</h3>
            <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Assessment Type</th>
                        <th>CO1</th>
                        <th>CO2</th>
                        <th>CO3</th>
                        <th>CO4</th>
                        <th>CO5</th>
                    </tr>
                </thead>
                <tbody>
                    {coData.map((data, index) => (
                        <tr key={index}>
                            <td>{data.formData?.Assessment_Type}</td>
                            <td>{data.weightedAveragePercentage?.CO1?.toFixed(2)}%</td>
                            <td>{data.weightedAveragePercentage?.CO2?.toFixed(2)}%</td>
                            <td>{data.weightedAveragePercentage?.CO3?.toFixed(2)}%</td>
                            <td>{data.weightedAveragePercentage?.CO4?.toFixed(2)}%</td>
                            <td>{data.weightedAveragePercentage?.CO5?.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllCOData;