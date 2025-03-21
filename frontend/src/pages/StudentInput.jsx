// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Papa from "papaparse"; // Import PapaParse for CSV parsing
// import "./DashboardStyles.css";

// const StudentInput = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     Program: "",
//     Batch: "",
//     Session: "",
//     Semester: "",
//     Course_Code: "",
//     Title: "",
//     Instructor: "",
//     Expected_Threshold: "",
//     Assessment_Type: "",
//   });

//   const [template, setTemplate] = useState({
//     numQuestions: "",
//     numActivities: "",
//   });

//   const [inputMethod, setInputMethod] = useState("");
//   const [pastedData, setPastedData] = useState("");
//   const [students, setStudents] = useState([]);
//   const [templateGenerated, setTemplateGenerated] = useState(false);

//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleTemplateChange = (e) => {
//     const { name, value } = e.target;
//     setTemplate({ ...template, [name]: value });
//   };

//   const generateTemplate = () => {
//     if (!template.numQuestions) {
//       alert("Please fill in the number of questions!");
//       return;
//     }
//     setTemplateGenerated(true);
//   };

//   const handleInputMethodChange = (e) => {
//     setInputMethod(e.target.value);
//   };

//   const handlePasteDataChange = (e) => {
//     setPastedData(e.target.value);
//   };

//   const processPastedData = () => {
//     const rows = pastedData.trim().split("\n");
//     const numQuestions = Number(template.numQuestions) || 0;
//     const numActivities = Number(template.numActivities) || 0;

//     const parsedStudents = rows.map((row) => {
//       const cols = row.split(/\s+/);
//       if (cols.length < 3 + numQuestions + numActivities) return null; // Ensure there are enough columns

//       const marks = cols.slice(2, 2 + numQuestions).map(Number); // Extract question marks
//       const total = Number(cols[2 + numQuestions]); // Extract total marks
//       const activities = cols.slice(3 + numQuestions, 3 + numQuestions + numActivities).map(Number); // Extract activity marks

//       return {
//         SNo: cols[0],
//         RegNo: cols[1],
//         Marks: marks,
//         Total: total, // Use the total marks from the input
//         Activities: activities,
//       };
//     }).filter(student => student !== null);

//     setStudents(parsedStudents);
//   };

//   // Papa.parse library to parse the uploaded CSV file
//   const handleCSVUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     Papa.parse(file, {
//       complete: (result) => {
//         const data = result.data;
//         if (data.length < 1) return;

//         const numQuestions = Number(template.numQuestions) || 0;
//         const numActivities = Number(template.numActivities) || 0;

//         const parsedStudents = data.map((row, index) => {
//           if (row.length < 3 + numQuestions + numActivities) return null; // Ensure there are enough columns

//           const marks = row.slice(2, 2 + numQuestions).map(Number); // Extract question marks
//           const total = Number(row[2 + numQuestions]); // Extract total marks
//           const activities = row.slice(3 + numQuestions, 3 + numQuestions + numActivities).map(Number); // Extract activity marks

//           return {
//             SNo: row[0],
//             RegNo: row[1],
//             Marks: marks,
//             Total: total, // Use the total marks from the input
//             Activities: activities,
//           };
//         }).filter(student => student !== null);

//         setStudents(parsedStudents);
//       },
//       skipEmptyLines: true,
//     });
//   };

//   const handleCOInput = () => {
//     if (students.length === 0) {
//         alert("Please input student data first!");
//         return;
//     }

//     // Validate formData
//     if (!formData.Assessment_Type || !formData.Expected_Threshold) {
//         alert("Please fill in all required fields in the form!");
//         return;
//     }

//     // Generate questionStructure based on Assessment_Type
//     const getQuestionStructure = (assessmentType) => {
//         const patterns = {
//             Assessment1: { partA: 7, partB: 2, partC: 1 },
//             Assessment2: { partA: 7, partB: 2, partC: 1 },
//             Lab: { partA: 3 },
//             Lab_EndSem: { partA: 5 },
//             End_Sem: { partA: 10, partB: 5, partC: 1 },
//         };
//         return patterns[assessmentType] || {};
//     };

//     const questionStructure = getQuestionStructure(formData.Assessment_Type);
//     if (!questionStructure) {
//         alert("Invalid assessment type!");
//         return;
//     }

//     // Navigate to COInputPage with the required data
//     navigate("/co-input", {
//         state: {
//             formData, // Pass the entire formData object
//             students, // Pass the student data
//             questionStructure, // Pass the generated question structure
//             expectedThreshold: formData.Expected_Threshold, // Pass the expected threshold
//         },
//     });
// };

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <button onClick={() => navigate("/student-records")}>Records</button>
//         <button onClick={() => navigate("/faculty-profile")}>Profile</button>
//         <button type="button" className="generate-co-button" onClick={handleCOInput}>
//           CO Input
//         </button>
//         <button onClick={() => navigate("/login")}>Logout</button>
//       </div>

//       <div className="main-content">
//       <h1 >Course Attainment</h1>

//         {/* Course Details Form */}
//         <form>
//           {Object.keys(formData).map((key) =>
//             key !== "Assessment_Type" ? (
//               <input
//                 key={key}
//                 type="text"
//                 name={key}
//                 placeholder={key.replace(/_/g, " ")}
//                 value={formData[key]}
//                 onChange={handleFormChange}
//                 required
//               />
//             ) : (
//               <select key={key} name={key} value={formData[key]} onChange={handleFormChange} required>
//                 <option value="">Select Assessment Type</option>
//                 <option value="Assessment1">Assessment 1</option>
//                 <option value="Assessment2">Assessment 2</option>
//                 <option value="Lab">Lab</option>
//                 <option value="Lab_EndSem">Lab End-Sem</option>
//                 <option value="End_Sem">End-Semester</option>
//               </select>
//             )
//           )}
//         </form>
//         {/* Template Input */}
//         <div className="template-section">
//           <h3>Generate Input Template</h3>

//           <div className="input-container">
//             <input
//               type="number"
//               name="numQuestions"
//               placeholder="No of Questions"
//               value={template.numQuestions}
//               onChange={handleTemplateChange}
//               required
//               className="custom-input"
//             />

//             <input
//               type="number"
//               name="numActivities"
//               placeholder="No of Activities"
//               value={template.numActivities}
//               onChange={handleTemplateChange}
//               className="custom-input"
//             />

//             <button className="generate-template-btn" type="button" onClick={generateTemplate}>
//               Generate Template
//             </button>
//           </div>
//         </div>


//         {/* Data Entry Section */}
//         {templateGenerated && (
//           <div>
//             <h3>Input Student Data</h3>
//             <select onChange={handleInputMethodChange} required>
//               <option value="">Select Input Method</option>
//               <option value="paste">Paste Data</option>
//               <option value="csv">Upload CSV</option>
//             </select>

//             {inputMethod === "paste" && (
//               <div>
//                 <textarea
//                   placeholder="Paste student data here..."
//                   value={pastedData}
//                   onChange={handlePasteDataChange}
//                   rows={5}
//                   className="paste-class"
//                 ></textarea>
//                 <button className="process-data-btn" type="button" onClick={processPastedData}>
//                   Process Data
//                 </button>
//               </div>
//             )}

//             {inputMethod === "csv" && (
//               <div>
//                 <input type="file" accept=".csv" onChange={handleCSVUpload} />
//               </div>
//             )}
//           </div>
//         )}

//         {/* Display Student Data */}
//         {students.length > 0 && (
//           <div className="students-preview">
//             <h2>Student Data</h2>
//             <table border="1">
//               <thead>
//                 <tr>
//                   <th>S No</th>
//                   <th>Registration No</th>
//                   {[...Array(Number(template.numQuestions))].map((_, index) => (
//                     <th key={index}>Q{index + 1}</th>
//                   ))}
//                   <th>Total</th>
//                   {[...Array(Number(template.numActivities))].map((_, index) => (
//                     <th key={index}>Activity {index + 1}</th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {students.map((student, index) => (
//                   <tr key={index}>
//                     <td>{student.SNo}</td>
//                     <td>{student.RegNo}</td>
//                     {student.Marks.map((mark, idx) => (
//                       <td key={idx}>{mark}</td>
//                     ))}
//                     <td>{student.Total}</td>
//                     {student.Activities.map((activity, idx) => (
//                       <td key={idx}>{activity}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentInput;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse"; // Import PapaParse for CSV parsing
import "./DashboardStyles.css";

const StudentInput = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Program: "",
        Batch: "",
        Session: "",
        Semester: "",
        Course_Code: "",
        Title: "",
        Instructor: "",
        Expected_Threshold: "",
        Assessment_Type: "",
    });

    const [template, setTemplate] = useState({
        numQuestions: "",
        numActivities: "",
    });

    const [inputMethod, setInputMethod] = useState("");
    const [pastedData, setPastedData] = useState("");
    const [students, setStudents] = useState([]);
    const [templateGenerated, setTemplateGenerated] = useState(false);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTemplateChange = (e) => {
        const { name, value } = e.target;
        setTemplate({ ...template, [name]: value });
    };

    const generateTemplate = () => {
        if (!template.numQuestions) {
            alert("Please fill in the number of questions!");
            return;
        }
        setTemplateGenerated(true);
    };

    const handleInputMethodChange = (e) => {
        setInputMethod(e.target.value);
    };

    const handlePasteDataChange = (e) => {
        setPastedData(e.target.value);
    };

    const processPastedData = () => {
        const rows = pastedData.trim().split("\n");
        const numQuestions = Number(template.numQuestions) || 0;
        const numActivities = Number(template.numActivities) || 0;

        const parsedStudents = rows.map((row) => {
            const cols = row.split(/\s+/);
            if (cols.length < 3 + numQuestions + numActivities) return null; // Ensure there are enough columns

            const marks = cols.slice(2, 2 + numQuestions).map(Number); // Extract question marks
            const total = Number(cols[2 + numQuestions]); // Extract total marks
            const activities = cols.slice(3 + numQuestions, 3 + numQuestions + numActivities).map(Number); // Extract activity marks

            return {
                SNo: cols[0],
                RegNo: cols[1],
                Marks: marks,
                Total: total, // Use the total marks from the input
                Activities: activities,
            };
        }).filter(student => student !== null);

        setStudents(parsedStudents);
    };

    const handleCSVUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        Papa.parse(file, {
            complete: (result) => {
                const data = result.data;
                if (data.length < 1) return;

                const numQuestions = Number(template.numQuestions) || 0;
                const numActivities = Number(template.numActivities) || 0;

                const parsedStudents = data.map((row, index) => {
                    if (row.length < 3 + numQuestions + numActivities) return null; // Ensure there are enough columns

                    const marks = row.slice(2, 2 + numQuestions).map(Number); // Extract question marks
                    const total = Number(row[2 + numQuestions]); // Extract total marks
                    const activities = row.slice(3 + numQuestions, 3 + numQuestions + numActivities).map(Number); // Extract activity marks

                    return {
                        SNo: row[0],
                        RegNo: row[1],
                        Marks: marks,
                        Total: total, // Use the total marks from the input
                        Activities: activities,
                    };
                }).filter(student => student !== null);

                setStudents(parsedStudents);
            },
            skipEmptyLines: true,
        });
    };

    const handleCOInput = () => {
        if (students.length === 0) {
            alert("Please input student data first!");
            return;
        }

        // Validate formData
        if (!formData.Assessment_Type || !formData.Expected_Threshold) {
            alert("Please fill in all required fields in the form!");
            return;
        }

        // Generate questionStructure based on Assessment_Type
        const getQuestionStructure = (assessmentType) => {
            const patterns = {
                Assessment1: { partA: 7, partB: 2, partC: 1 },
                Assessment2: { partA: 7, partB: 2, partC: 1 },
                Lab_Assessment: { partA: 3 },
                Lab_EndSem: { partA: 5 },
                End_Sem: { partA: 10, partB: 5, partC: 1 },
            };
            return patterns[assessmentType] || {};
        };

        const questionStructure = getQuestionStructure(formData.Assessment_Type);
        if (!questionStructure) {
            alert("Invalid assessment type!");
            return;
        }

        // Navigate to COInputPage with the required data
        navigate("/co-input", {
            state: {
                formData, // Pass the entire formData object
                students, // Pass the student data
                questionStructure, // Pass the generated question structure
                expectedThreshold: formData.Expected_Threshold, // Pass the expected threshold
            },
        });
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <button onClick={() => navigate("/faculty-profile")}>Profile</button>
                <button type="button" className="generate-co-button" onClick={handleCOInput}>
                    CO Input
                </button>
                <button
                    onClick={() => navigate("/all-co-data")}
                    >All CO Data
                    </button>
                <button onClick={() => navigate("/login")}>Logout</button>
            </div>

            <div className="main-content">
                <h1>Course Attainment</h1>

                {/* Course Details Form */}
                <form>
                    {Object.keys(formData).map((key) =>
                        key !== "Assessment_Type" ? (
                            <input
                                key={key}
                                type="text"
                                name={key}
                                placeholder={key.replace(/_/g, " ")}
                                value={formData[key]}
                                onChange={handleFormChange}
                                required
                            />
                        ) : (
                            <select key={key} name={key} value={formData[key]} onChange={handleFormChange} required>
                                <option value="">Select Assessment Type</option>
                                <option value="Assessment1">Assessment 1</option>
                                <option value="Assessment2">Assessment 2</option>
                                <option value="Lab_Assessment">Lab Assessment</option>
                                <option value="Lab_EndSem">Lab End-Sem</option>
                                <option value="End_Sem">End-Semester</option>
                            </select>
                        )
                    )}
                </form>

                {/* Template Input */}
                <div className="template-section">
                    <h3>Generate Input Template</h3>

                    <div className="input-container">
                        <input
                            type="number"
                            name="numQuestions"
                            placeholder="No of Questions"
                            value={template.numQuestions}
                            onChange={handleTemplateChange}
                            required
                            className="custom-input"
                        />

                        <input
                            type="number"
                            name="numActivities"
                            placeholder="No of Activities"
                            value={template.numActivities}
                            onChange={handleTemplateChange}
                            className="custom-input"
                        />

                        <button className="generate-template-btn" type="button" onClick={generateTemplate}>
                            Generate Template
                        </button>
                    </div>
                </div>

                {/* Data Entry Section */}
                {templateGenerated && (
                    <div>
                        <h3>Input Student Data</h3>
                        <select onChange={handleInputMethodChange} required>
                            <option value="">Select Input Method</option>
                            <option value="paste">Paste Data</option>
                            <option value="csv">Upload CSV</option>
                        </select>

                        {inputMethod === "paste" && (
                            <div>
                                <textarea
                                    placeholder="Paste student data here..."
                                    value={pastedData}
                                    onChange={handlePasteDataChange}
                                    rows={5}
                                    className="paste-class"
                                ></textarea>
                                <button className="process-data-btn" type="button" onClick={processPastedData}>
                                    Process Data
                                </button>
                            </div>
                        )}

                        {inputMethod === "csv" && (
                            <div>
                                <input type="file" accept=".csv" onChange={handleCSVUpload} />
                            </div>
                        )}
                    </div>
                )}

                {/* Display Student Data */}
                {students.length > 0 && (
                    <div className="students-preview">
                        <h2>Student Data</h2>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Registration No</th>
                                    {[...Array(Number(template.numQuestions))].map((_, index) => (
                                        <th key={index}>Q{index + 1}</th>
                                    ))}
                                    <th>Total</th>
                                    {[...Array(Number(template.numActivities))].map((_, index) => (
                                        <th key={index}>Activity {index + 1}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td>{student.SNo}</td>
                                        <td>{student.RegNo}</td>
                                        {student.Marks.map((mark, idx) => (
                                            <td key={idx}>{mark}</td>
                                        ))}
                                        <td>{student.Total}</td>
                                        {student.Activities.map((activity, idx) => (
                                            <td key={idx}>{activity}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentInput;