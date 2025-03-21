import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const MCASelfSupportPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        serialNumber: "",
        courseCode: "",
        course: "",
        semester: "",
        academicYear: "",
        staff: "",
        assessment1: { CO1: "", CO2: "", CO3: "", CO4: "", CO5: "", CO6: "" },
        assessment2: { CO1: "", CO2: "", CO3: "", CO4: "", CO5: "", CO6: "" },
    });
    const [submittedData, setSubmittedData] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [parent, child] = name.split(".");

        if (child) {
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedData(formData); // Store the form data for display
    };

    return (
        <div className="assessment-form">
            <h2>Course Assessment Form</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Serial Number:</label>
                    <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Course Code:</label>
                    <input type="text" name="courseCode" value={formData.courseCode} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Course:</label>
                    <input type="text" name="course" value={formData.course} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Semester:</label>
                    <input type="text" name="semester" value={formData.semester} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Academic Year:</label>
                    <input type="text" name="academicYear" value={formData.academicYear} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                    <label>Staff:</label>
                    <input type="text" name="staff" value={formData.staff} onChange={handleInputChange} required />
                </div>
                
                <h3>Assessment 1</h3>
                {["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"].map((co) => (
                    <div className="form-group" key={co}>
                        <label>{co}:</label>
                        <input type="number" name={`assessment1.${co}`} value={formData.assessment1[co]} onChange={handleInputChange} required />
                    </div>
                ))}
                
                <h3>Assessment 2</h3>
                {["CO1", "CO2", "CO3", "CO4", "CO5", "CO6"].map((co) => (
                    <div className="form-group" key={co}>
                        <label>{co}:</label>
                        <input type="number" name={`assessment2.${co}`} value={formData.assessment2[co]} onChange={handleInputChange} required />
                    </div>
                ))}
                
                <button type="submit">Submit</button>
            </form>

            {submittedData && (
                <div className="submitted-data">
                    <h3>Submitted Data:</h3>
                    <pre>{JSON.stringify(submittedData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default MCASelfSupportPage;
