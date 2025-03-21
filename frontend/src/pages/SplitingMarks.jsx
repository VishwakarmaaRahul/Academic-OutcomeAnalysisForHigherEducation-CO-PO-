import React, { useState, useEffect } from "react";
import axios from "axios";
import './DashboardStyles.css';

const SplitingMarks = () => {
  // Initialize an empty table
  const [tableData, setTableData] = useState([]);

  // Fetch data from the backend when the component mounts
  useEffect(() => {
    fetchTableData();
  }, []);

  // Function to fetch table data from the backend
  const fetchTableData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/getData");
      if (response.data) {
        setTableData(response.data); // Set the fetched data to the state
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  // Function to handle input change
  const handleChange = (index, field, value) => {
    setTableData((prevData) =>
      prevData.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  };

  // Function to add a new row
  const addRow = () => {
    setTableData((prevData) => [
      ...prevData,
      {
        type: "",
        L: "",
        P: "",
        C: "",
        test1: "",
        activity1: "",
        test2: "",
        activity2: "",
        labInternals: "",
        internals: "",
        labEndsem: "",
        theoryEndsem: "",
      },
    ]);
  };

  // Save entered data to MongoDB
  const saveData = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/saveData", tableData);
      alert("Data saved successfully!");
      fetchTableData(); // Refresh the table data after saving
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div className="container-splitMarks">
      <h2>Internals Split Percentage</h2>
      <table className="table-of-split">
        <thead>
          <tr>
            <th>Type</th>
            <th>L</th>
            <th>P</th>
            <th>C</th>
            <th>Test 1</th>
            <th>Activity 1</th>
            <th>Test 2</th>
            <th>Activity 2</th>
            <th>Lab Internals</th>
            <th className="orange-bg">Internals</th>
            <th className="orange-bg">Lab Endsem</th>
            <th className="orange-bg">Theory EndSem</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.type}
                  onChange={(e) => handleChange(index, "type", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.L}
                  onChange={(e) => handleChange(index, "L", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.P}
                  onChange={(e) => handleChange(index, "P", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.C}
                  onChange={(e) => handleChange(index, "C", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.test1}
                  onChange={(e) => handleChange(index, "test1", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.activity1}
                  onChange={(e) => handleChange(index, "activity1", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.test2}
                  onChange={(e) => handleChange(index, "test2", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.activity2}
                  onChange={(e) => handleChange(index, "activity2", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.labInternals}
                  onChange={(e) => handleChange(index, "labInternals", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.internals}
                  onChange={(e) => handleChange(index, "internals", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.labEndsem}
                  onChange={(e) => handleChange(index, "labEndsem", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.theoryEndsem}
                  onChange={(e) => handleChange(index, "theoryEndsem", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="add-row-button" onClick={addRow}>
        Add Row
      </button>
      <button className="save-data-button" onClick={saveData}>
        Save Data
      </button>
    </div>
  );
};

export default SplitingMarks;