// import { useState } from "react";
// import React from 'react';
// import { useLocation, useNavigate } from "react-router-dom";

// const COInputPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate(); // Initialize useNavigate
//     const { formData, students, questionStructure, expectedThreshold } = location.state || {};
//     const totalStudents = students?.length || 0;
//     const cos = ["CO1", "CO2", "CO3", "CO4", "CO5"];
//     const [inputMode, setInputMode] = useState(null); // Default to null

//     // State variables to control visibility of each section
//     const [showStudentMarks, setShowStudentMarks] = useState(false);
//     const [showCOWiseMarks, setShowCOWiseMarks] = useState(false);
//     const [showThresholdData, setShowThresholdData] = useState(false);
//     const [showWeightedAveragePercentage, setShowWeightedAveragePercentage] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     console.log("Location State:", location.state);
//     console.log("Form Data:", formData);

//     // Flatten questions across parts (A, B, C)
//     let questions = [];
//     let qNo = 1;
//     Object.entries(questionStructure).forEach(([part, count]) => {
//         for (let i = 0; i < count; i++) {
//             questions.push({ qNo, part });
//             qNo++;
//         }
//     });

//     // Initialize state for checkboxes
//     const [selected, setSelected] = useState(
//         questions.reduce((acc, { qNo }) => {
//             acc[qNo] = cos.reduce((coAcc, co) => {
//                 coAcc[co] = false;
//                 return coAcc;
//             }, {});
//             return acc;
//         }, {})
//     );

//     // Initialize state for marks
//     const [marks, setMarks] = useState(
//         questions.reduce((acc, { qNo }) => {
//             acc[qNo] = ""; // Default empty string for marks
//             return acc;
//         }, {})
//     );

//     // Initialize state for studentsAboveThreshold
//     const [studentsAboveThreshold, setStudentsAboveThreshold] = useState({});

//     // Handle checkbox change
//     const handleCheckboxChange = (qNo, co) => {
//         setSelected((prev) => ({
//             ...prev,
//             [qNo]: { ...prev[qNo], [co]: !prev[qNo][co] }
//         }));
//     };

//     // Handle marks input change
//     const handleMarksChange = (qNo, value) => {
//         setMarks((prev) => ({
//             ...prev,
//             [qNo]: value
//         }));
//     };

//     const [activityCount, setActivityCount] = useState(0);
//     const [activities, setActivities] = useState([]);

//     const handleActivityCountChange = (count) => {
//         setActivityCount(count);
//         setActivities(new Array(parseInt(count)).fill({ marks: 0, selectedCOs: {} }));
//     };

//     const handleActivityChange = (index, field, value) => {
//         setActivities(prev => {
//             const updated = [...prev];
//             if (field === "marks") {
//                 updated[index] = { ...updated[index], marks: parseInt(value) || 0 };
//             } else {
//                 updated[index] = {
//                     ...updated[index],
//                     selectedCOs: {
//                         ...updated[index].selectedCOs,
//                         [value]: !updated[index].selectedCOs[value] // Toggle checkbox state
//                     }
//                 };
//             }
//             return updated;
//         });
//     };

//     // Calculate CO-wise marks for questions
//     const calculateCOWiseQuestionMarks = () => {
//         return students?.map(student => {
//             let coWiseMarks = cos.reduce((acc, co) => {
//                 acc[co] = 0;
//                 return acc;
//             }, {});

//             student.Marks.forEach((mark, idx) => {
//                 let qNo = idx + 1; // Questions are 1-based index
//                 if (selected[qNo]) {
//                     cos.forEach(co => {
//                         if (selected[qNo][co]) {
//                             coWiseMarks[co] += mark;
//                         }
//                     });
//                 }
//             });

//             return {
//                 ...student,
//                 CO_QuestionMarks: coWiseMarks
//             };
//         });
//     };

//     // Calculate CO-wise marks for activities
//     const calculateCOWiseActivityMarks = () => {
//         const coActivityMarks = students?.map((student) => {
//             // Initialize CO-wise activity marks for the student
//             let coWiseActivityMarks = cos.reduce((acc, co) => {
//                 acc[co] = 0; // Initialize CO-wise activity marks to 0
//                 return acc;
//             }, {});

//             // Loop through activities and assign student's activity marks to the selected COs
//             activities.forEach((activity, activityIndex) => {
//                 const activityMarks = student.Activities[activityIndex]; // Get the student's marks for this activity

//                 cos.forEach((co) => {
//                     if (activity.selectedCOs[co]) {
//                         // Add the student's activity marks to the corresponding CO
//                         coWiseActivityMarks[co] += parseInt(activityMarks) || 0;
//                     }
//                 });
//             });

//             return {
//                 ...student,
//                 CO_ActivityMarks: coWiseActivityMarks, // Add CO-wise activity marks to the student object
//             };
//         });
//         return coActivityMarks;
//     };



//     // Convert selected data to count for each CO
//     const coCounts = cos.map(co => ({
//         name: co,
//         count: Object.values(selected).reduce((sum, q) => sum + (q[co] ? 1 : 0), 0)
//     }));

//     // Calculate total marks for each CO (based on questions only)
//     const coMarks = cos.map(co => ({
//         name: co,
//         totalMarks: Object.entries(selected).reduce((sum, [qNo, q]) => {
//             return sum + (q[co] ? (parseInt(marks[qNo]) || 0) : 0);
//         }, 0)
//     }));

//     const thresholdMarks = coMarks.map(co => ({
//         name: co.name,
//         threshold: co.totalMarks * (expectedThreshold / 100)
//     }));

//     // Calculate the percentage of students above the threshold for each CO
//     const studentsAboveThresholdPercentage = cos.reduce((acc, co) => {
//         const count = studentsAboveThreshold[co] || 0; // Ensure it's treated as 0 if undefined
//         acc[co] = (totalStudents > 0 && count > 0)
//             ? ((count / totalStudents) * 100)
//             : 0; // Set 0 if totalStudents is zero or count is zero
//         return acc;
//     }, {});

//     const calculateTotalActivityMarksPerCO = () => {
//         // Initialize an object to store total activity marks for each CO
//         const totalActivityMarks = cos.reduce((acc, co) => {
//             acc[co] = 0; // Initialize each CO's total marks to 0
//             return acc;
//         }, {});

//         // Iterate through activities and add marks to the corresponding COs
//         activities.forEach((activity) => {
//             cos.forEach((co) => {
//                 if (activity.selectedCOs[co]) {
//                     // Add the activity marks to the corresponding CO
//                     totalActivityMarks[co] += parseInt(activity.marks) || 0;
//                 }
//             });
//         });

//         return totalActivityMarks;
//     };

//     // Calculate total activity marks for each CO
//     const totalActivityMarksPerCO = calculateTotalActivityMarksPerCO();

//     // Calculate threshold marks for each CO (based on activity marks only)
//     const thresholdMarksActivity = cos.reduce((acc, co) => {
//         acc[co] = (totalActivityMarksPerCO[co] || 0) * (expectedThreshold / 100);
//         return acc;
//     }, {});

//     // Calculate CO-wise activity marks for each student
//     const coWiseActivityMarks = calculateCOWiseActivityMarks();

//     // Count students who scored above the threshold for each CO
//     const studentsAboveThresholdActivity = cos.reduce((acc, co) => {
//         // If threshold marks are 0, no student can score above the threshold
//         if (thresholdMarksActivity[co] === 0) {
//             acc[co] = 0;
//         } else {
//             // Count students who scored above the threshold for the CO
//             acc[co] = coWiseActivityMarks.filter(
//                 (student) => student.CO_ActivityMarks[co] >= thresholdMarksActivity[co]
//             ).length;
//         }
//         return acc;
//     }, {});
   
//     // Calculate the percentage of students above the threshold for each CO
//     const studentsAboveThresholdPercentageActivity = cos.reduce((acc, co) => {
//         acc[co] = totalStudents > 0
//             ? ((studentsAboveThresholdActivity[co] / totalStudents) * 100)
//             : 0; // Handle division by zero
//         return acc;
//     }, {});

//     // Calculate the weighted average for each CO
//     const weightedAveragePercentage = cos.reduce((acc, co) => {
//         if (studentsAboveThresholdPercentage[co] === 0) {
//             acc[co] = studentsAboveThresholdPercentageActivity[co] * 1.0;
//         } else if (studentsAboveThresholdPercentageActivity[co] === 0) {
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0;
//         } else {
//             acc[co] = (0.6 * studentsAboveThresholdPercentage[co]) + (0.4 * studentsAboveThresholdPercentageActivity[co]);
//         }
//         return acc;
//     }, {});
    
//     console.log("weightedAveragePercentage:", weightedAveragePercentage);  // Log the calculated values


//         const handleSubmit = async (e) => {
//             e.preventDefault();  // Prevent default form submission
//             if (isSubmitting) return;  // Prevent multiple submissions
//             setIsSubmitting(true);  // Set submitting state to true
        
//             try {
//                 console.log("handleSubmit called");  // Log when the function is called
        
//                 // Calculate CO-wise marks for questions
//                 const coQuestionMarks = calculateCOWiseQuestionMarks();
        
//                 // Calculate CO-wise marks for activities
//                 const coActivityMarks = calculateCOWiseActivityMarks();
        
//               // Calculate threshold marks for each CO (based on questions only)
//                   const thresholdMarks = cos.reduce((acc, co) => {
//                         acc[co] = (coMarks.find((item) => item.name === co)?.totalMarks || 0) * (expectedThreshold / 100);
//                         return acc;
//                     }, {});
        
//                    // Count students who score above the threshold for each CO (based on questions only)
//                     let studentsAboveThreshold = cos.reduce((acc, co) => {
//                         acc[co] = coQuestionMarks.filter(student => student.CO_QuestionMarks[co] >= thresholdMarks[co]).length;
//                         return acc;
//                     }, {});
//                     // Update the state with the calculated studentsAboveThreshold
//                     setStudentsAboveThreshold(studentsAboveThreshold);
        
//                 // Prepare the data to be sent to the backend
//                 const coData = {
//                     formData,
//                     students,
//                     coWiseMarks: {
//                         coQuestionMarks,
//                         coActivityMarks
//                     },
//                     studentsAboveThresholdPercentage,
//                     studentsAboveThresholdPercentageActivity,
//                     weightedAveragePercentage
//                 };
        
//                 // Send the data to the Flask backend
//                 const response = await fetch('/auth/submit-co-data', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`
//                     },
//                     body: JSON.stringify(coData)
//                 });
        
//                 if (response.ok) {
//                     alert("CO & Marks Data submitted successfully!");
//                 } else {
//                     alert("Failed to submit CO & Marks Data.");
//                 }
//             } catch (error) {
//                 console.error("Error submitting CO data:", error);
//                 alert("An error occurred while submitting CO data.");
//             } finally {
//                 setIsSubmitting(false);  // Reset submitting state
//             }
//         };


//         // Use the data as needed
//         console.log("Form Data:", formData);
//         console.log("Students:", students);
//         console.log("Question Structure:", questionStructure);
//         console.log("Expected Threshold:", expectedThreshold);

//         console.log("studentsAboveThresholdPercentage:", studentsAboveThresholdPercentage);
//         console.log("studentsAboveThresholdPercentageActivity:", studentsAboveThresholdPercentageActivity);
//         console.log("weightedAveragePercentage:", weightedAveragePercentage);
    
    
//     // Add a function to handle navigation to the CO Data Display page
//     const handleViewCOData = () => {
//         navigate('/co-data-display'); // Navigate to the CO Data Display page
//     };

//     return (
//         <>
//             <h2>CO Input System</h2>
//             <div className="layout-container">
//                 {/* Sidebar for Buttons */}
//                 <div className="sidebar">
//                     <div className="button-container">
//                         <button className="toggle-btn" onClick={() => setInputMode("question")}>
//                             CO-Assessment
//                         </button>
//                         <button className="toggle-btn" onClick={() => setInputMode("activity")}>
//                             CO-Activity
//                         </button>
//                                                 <button onClick={handleViewCOData}>
//                             All CO Data
//                         </button>
//                     </div>
//                     <div className="toggle-buttons">
//                         <button onClick={() => setShowStudentMarks(!showStudentMarks)}>
//                             {showStudentMarks ? "Hide Student Marks" : "Student Marks"}
//                         </button>
//                         <button onClick={() => setShowCOWiseMarks(!showCOWiseMarks)}>
//                             {showCOWiseMarks ? "Hide CO-wise Marks" : "CO-wise Marks"}
//                         </button>
//                         <button onClick={() => setShowThresholdData(!showThresholdData)}>
//                             {showThresholdData ? "Hide Total CO" : "Total CO"}
//                         </button>
//                         <button onClick={() => setShowWeightedAveragePercentage(!showWeightedAveragePercentage)}>
//                             {showWeightedAveragePercentage ? "Hide CO(Combined)" : "CO(Combined)"}
//                         </button>
//                     </div>
//                 </div>
    
//                 {/* Main Content Area */}
//                 <div className="main-content">
//                     {/* Conditionally render input fields based on inputMode */}
//                     {inputMode && (
//                         <div className="co-checkbox-container">
//                             <div className="co-checkbox">
//                                 {inputMode === "question" && (
//                                     <div>
//                                         <h3>Enter Assessment</h3>
//                                         <table border="1">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Q.No</th>
//                                                     <th>Marks</th>
//                                                     {cos.map((co) => (
//                                                         <th key={co}>{co}</th>
//                                                     ))}
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {questions.map(({ qNo }) => (
//                                                     <tr key={qNo}>     {/*Defines a row in the table.*/}
//                                                         <td>{qNo}</td>  {/*Defines a standard data cell.*/}
//                                                         <td>
//                                                             <select
//                                                                 value={marks[qNo] || ""}
//                                                                 onChange={(e) => handleMarksChange(qNo, e.target.value)}
//                                                             >
//                                                                 <option value="">Select Marks</option>
//                                                                 {[2, 12, 13, 15].map((mark) => (
//                                                                     <option key={mark} value={mark}>
//                                                                         {mark}
//                                                                     </option>
//                                                                 ))}
//                                                             </select>
//                                                         </td>
//                                                         {cos.map((co) => (
//                                                             <td key={co} style={{ textAlign: "center" }}>
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     checked={selected[qNo]?.[co] || false}
//                                                                     onChange={() => handleCheckboxChange(qNo, co)}
//                                                                 />
//                                                             </td>
//                                                         ))}
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                                 {inputMode === "activity" && (
//                                     <div>
//                                         <h3>Enter Number of Activities</h3>
//                                         <input
//                                             type="number"
//                                             value={activityCount}
//                                             onChange={(e) => handleActivityCountChange(e.target.value)}
//                                         />
//                                         <table border="1">
//                                             <thead>
//                                                 <tr>
//                                                     <th>Activity No</th>
//                                                     <th>Marks</th>
//                                                     {cos.map((co) => (
//                                                         <th key={co}>{co}</th>
//                                                     ))}
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {activities.map((activity, index) => (
//                                                     <tr key={index}>
//                                                         <td>{index + 1}</td>
//                                                         <td>
//                                                             <input
//                                                                 type="number"
//                                                                 value={activity.marks}
//                                                                 onChange={(e) => handleActivityChange(index, "marks", e.target.value)}
//                                                             />
//                                                         </td>
//                                                         {cos.map((co) => (
//                                                             <td key={co}>
//                                                                 <input
//                                                                     type="checkbox"
//                                                                     checked={activity.selectedCOs[co] || false}
//                                                                     onChange={() => handleActivityChange(index, "selectedCOs", co)}
//                                                                 />
//                                                             </td>
//                                                         ))}
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     )}

//                     {/* Submit Button */}
//                     <button onClick={handleSubmit}>Submit</button>
    
//                     {/* Result Sections */}
//                     {showStudentMarks && students && students.length > 0 && (
//                         <div>
//                             <h2>Student Marks</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>S No</th>
//                                         <th>Registration No</th>
//                                         {students[0]?.Marks.map((_, index) => (
//                                             <th key={index}>Q{index + 1}</th>
//                                         ))}
//                                         <th>Total</th>
//                                         {students[0]?.Activities.map((_, index) => (
//                                             <th key={index}>Activity {index + 1}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {students.map((student, index) => (
//                                         <tr key={index}>
//                                             <td>{student.SNo}</td>
//                                             <td>{student.RegNo}</td>
//                                             {student.Marks.map((mark, idx) => (
//                                                 <td key={idx}>{mark}</td>
//                                             ))}
//                                             <td>{student.Total}</td>
//                                             {student.Activities.map((activity, idx) => (
//                                                 <td key={idx}>{activity}</td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                     {showCOWiseMarks && (
//                     <div>
//                         <h2>CO-wise Student Marks (Assessment and Activities)</h2>
//                         <table border="1">
//                             <thead>
//                                 <tr>
//                                     <th rowSpan="2">S No</th>
//                                     <th rowSpan="2">Registration No</th>
//                                     <th colSpan={cos.length}>CO-wise Assessment Marks</th>
//                                     {/* Conditionally render Activity Marks header if activity marks exist */}
//                                     {activities.length > 0 && (
//                                         <th colSpan={cos.length}>CO-wise Activity Marks</th>
//                                     )}
//                                 </tr>
//                                 <tr>
//                                     {/* Render Assessment CO headers */}
//                                     {cos.map(co => (
//                                         <th key={co}>{co}</th>
//                                     ))}
//                                     {/* Conditionally render Activity CO headers if activity marks exist */}
//                                     {activities.length > 0 && 
//                                         cos.map(co => (
//                                             <th key={co}>{co}</th>
//                                         ))
//                                     }
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {calculateCOWiseQuestionMarks().map((student, index) => {
//                                     const activityMarks = calculateCOWiseActivityMarks()[index];
//                                     return (
//                                         <tr key={index}>
//                                             <td>{student.SNo}</td>
//                                             <td>{student.RegNo}</td>
//                                             {/* Render Assessment Marks */}
//                                             {cos.map(co => (
//                                                 <td key={co}>{student.CO_QuestionMarks?.[co] || 0}</td>
//                                             ))}
//                                             {/* Conditionally render Activity Marks if activity marks exist */}
//                                             {activities.length > 0 && 
//                                                 cos.map(co => (
//                                                     <td key={co}>{activityMarks.CO_ActivityMarks?.[co] || 0}</td>
//                                                 ))
//                                             }
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//                 {showThresholdData && (
//                 <div>
//                     <h2>Students Total CO and Percentage</h2>
//                     <table border="1">
//                         <thead>
//                             <tr>
//                                 <th>CO</th>
//                                 <th>Total CO (Assessment)</th>
//                                 <th>Total CO In Percentage (Assessment)</th>
//                                 {/* Conditionally render Activity columns if activity marks exist */}
//                                 {activities.length > 0 && (
//                                     <>
//                                         <th>Total CO (Activities)</th>
//                                         <th>Total CO In Percentage (Activities)</th>
//                                     </>
//                                 )}
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {cos.map(co => (
//                                 <tr key={co}>
//                                     <td>{co}</td>
//                                     <td>{thresholdMarks.find(t => t.name === co)?.threshold.toFixed(2)}</td>
//                                     <td>{studentsAboveThresholdPercentage[co].toFixed(2)}%</td>
//                                     {/* Conditionally render Activity data if activity marks exist */}
//                                     {activities.length > 0 && (
//                                         <>
//                                             <td>{thresholdMarksActivity[co].toFixed(2)}</td>
//                                             <td>{studentsAboveThresholdPercentageActivity[co].toFixed(2)}%</td>
//                                         </>
//                                     )}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
    
//                     {showWeightedAveragePercentage && (
//                         <div>
//                             <h2>CO(Assessment and Activity Combined)</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>CO</th>
//                                         <th>CO(Assessment and Activity Combined)</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cos.map(co => (
//                                         <tr key={co}>
//                                             <td>{co}</td>
//                                             <td>{weightedAveragePercentage[co].toFixed(2)}%</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default COInputPage;



// import { useState } from "react";
// import React from 'react';
// import { useLocation, useNavigate } from "react-router-dom";

// const COInputPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { formData, students, questionStructure, expectedThreshold } = location.state || {};
//     const totalStudents = students?.length || 0;
//     const cos = ["CO1", "CO2", "CO3", "CO4", "CO5"];
//     const [inputMode, setInputMode] = useState(null); // Default to null

//     // State variables to control visibility of each section
//     const [showStudentMarks, setShowStudentMarks] = useState(false);
//     const [showCOWiseMarks, setShowCOWiseMarks] = useState(false);
//     const [showThresholdData, setShowThresholdData] = useState(false);
//     const [showWeightedAveragePercentage, setShowWeightedAveragePercentage] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // // Debugging logs
//     // console.log("Location State:", location.state);
//     // console.log("Form Data:", formData);
//     // console.log("Assessment Type:", formData?.Assessment_Type);

//     // Check the assessment type from formData
//     const isAssessment1 = formData?.Assessment_Type === "Assessment1";
//     const isAssessment2 = formData?.Assessment_Type === "Assessment2";
//     // console.log("isAssessment1:", isAssessment1);
//     // console.log("isAssessment2:", isAssessment2);



//     // Flatten questions across parts (A, B, C)
//     let questions = [];
//     let qNo = 1;
//     Object.entries(questionStructure).forEach(([part, count]) => {
//         for (let i = 0; i < count; i++) {
//             questions.push({ qNo, part });
//             qNo++;
//         }
//     });

//     // Initialize state for checkboxes
//     const [selected, setSelected] = useState(
//         questions.reduce((acc, { qNo }) => {
//             acc[qNo] = cos.reduce((coAcc, co) => {
//                 coAcc[co] = false;
//                 return coAcc;
//             }, {});
//             return acc;
//         }, {})
//     );

//     // Initialize state for marks
//     const [marks, setMarks] = useState(
//         questions.reduce((acc, { qNo }) => {
//             acc[qNo] = ""; // Default empty string for marks
//             return acc;
//         }, {})
//     );

//     // Initialize state for studentsAboveThreshold
//     const [studentsAboveThreshold, setStudentsAboveThreshold] = useState({});

//     // Handle checkbox change
//     const handleCheckboxChange = (qNo, co) => {
//         setSelected((prev) => ({
//             ...prev,
//             [qNo]: { ...prev[qNo], [co]: !prev[qNo][co] }
//         }));
//     };

//     // Handle marks input change
//     const handleMarksChange = (qNo, value) => {
//         setMarks((prev) => ({
//             ...prev,
//             [qNo]: value
//         }));
//     };

//     const [activityCount, setActivityCount] = useState(0);
//     const [activities, setActivities] = useState([]);

//     const handleActivityCountChange = (count) => {
//         setActivityCount(count);
//         setActivities(new Array(parseInt(count)).fill({ marks: 0, selectedCOs: {} }));
//     };

//     const handleActivityChange = (index, field, value) => {
//         setActivities(prev => {
//             const updated = [...prev];
//             if (field === "marks") {
//                 updated[index] = { ...updated[index], marks: parseInt(value) || 0 };
//             } else {
//                 updated[index] = {
//                     ...updated[index],
//                     selectedCOs: {
//                         ...updated[index].selectedCOs,
//                         [value]: !updated[index].selectedCOs[value] // Toggle checkbox state
//                     }
//                 };
//             }
//             return updated;
//         });
//     };

//     // Calculate CO-wise marks for questions
//     const calculateCOWiseQuestionMarks = () => {
//         return students?.map(student => {
//             let coWiseMarks = cos.reduce((acc, co) => {
//                 acc[co] = 0;
//                 return acc;
//             }, {});

//             student.Marks.forEach((mark, idx) => {
//                 let qNo = idx + 1; // Questions are 1-based index
//                 if (selected[qNo]) {
//                     cos.forEach(co => {
//                         if (selected[qNo][co]) {
//                             coWiseMarks[co] += mark;
//                         }
//                     });
//                 }
//             });

//             return {
//                 ...student,
//                 CO_QuestionMarks: coWiseMarks
//             };
//         });
//     };

//     // Calculate CO-wise marks for activities
//     const calculateCOWiseActivityMarks = () => {
//         const coActivityMarks = students?.map((student) => {
//             // Initialize CO-wise activity marks for the student
//             let coWiseActivityMarks = cos.reduce((acc, co) => {
//                 acc[co] = 0; // Initialize CO-wise activity marks to 0
//                 return acc;
//             }, {});

//             // Loop through activities and assign student's activity marks to the selected COs
//             activities.forEach((activity, activityIndex) => {
//                 const activityMarks = student.Activities[activityIndex]; // Get the student's marks for this activity

//                 cos.forEach((co) => {
//                     if (activity.selectedCOs[co]) {
//                         // Add the student's activity marks to the corresponding CO
//                         coWiseActivityMarks[co] += parseInt(activityMarks) || 0;
//                     }
//                 });
//             });

//             return {
//                 ...student,
//                 CO_ActivityMarks: coWiseActivityMarks, // Add CO-wise activity marks to the student object
//             };
//         });
//         return coActivityMarks;
//     };

//     // Convert selected data to count for each CO
//     const coCounts = cos.map(co => ({
//         name: co,
//         count: Object.values(selected).reduce((sum, q) => sum + (q[co] ? 1 : 0), 0)
//     }));

//         // Calculate total marks for each CO (based on questions only)
//         const coMarks = cos.map(co => ({
//             name: co,
//             totalMarks: Object.entries(selected).reduce((sum, [qNo, q]) => {
//                 return sum + (q[co] ? (parseInt(marks[qNo]) || 0) : 0);
//             }, 0)
//         }));
//         // console.log("co Marks",coMarks);
        
    
//         const thresholdMarks = coMarks.map(co => ({
//             name: co.name,
//             threshold: co.totalMarks * (expectedThreshold / 100)
//         }));
//         // console.log("Threshol dMarks",thresholdMarks);
        


//     // Calculate the percentage of students above the threshold for each CO
//     const studentsAboveThresholdPercentage = cos.reduce((acc, co) => {
//         // If threshold marks are 0, no student can score above the threshold
//         if (thresholdMarks[co] === 0) {
//             acc[co] = 0;
//         } else {
//             // Count students who scored above the threshold for the CO
//             const count = studentsAboveThreshold[co] || 0; // Ensure it's treated as 0 if undefined
//             acc[co] = (totalStudents > 0 && count > 0)
//                 ? ((count / totalStudents) * 100)
//                 : 0; // Set 0 if totalStudents is zero or count is zero
//         }
//         return acc;
//     }, {});
//     // console.log("studentsAboveThresholdPercentage:", studentsAboveThresholdPercentage);

//     const calculateTotalActivityMarksPerCO = () => {
//         // Initialize an object to store total activity marks for each CO
//         const totalActivityMarks = cos.reduce((acc, co) => {
//             acc[co] = 0; // Initialize each CO's total marks to 0
//             return acc;
//         }, {});

//         // Iterate through activities and add marks to the corresponding COs
//         activities.forEach((activity) => {
//             cos.forEach((co) => {
//                 if (activity.selectedCOs[co]) {
//                     // Add the activity marks to the corresponding CO
//                     totalActivityMarks[co] += parseInt(activity.marks) || 0;
//                 }
//             });
//         });

//         return totalActivityMarks;
//     };

//     // Calculate total activity marks for each CO
//     const totalActivityMarksPerCO = calculateTotalActivityMarksPerCO();
//     // console.log("Total Activity Marks PerCO : ",totalActivityMarksPerCO);

//     // Calculate threshold marks for each CO (based on activity marks only)
//     const thresholdMarksActivity = cos.reduce((acc, co) => {
//         acc[co] = (totalActivityMarksPerCO[co] || 0) * (expectedThreshold / 100);
//         return acc;
//     }, {});

//     // Calculate CO-wise activity marks for each student
//     const coWiseActivityMarks = calculateCOWiseActivityMarks();

//     // Count students who scored above the threshold for each CO
//     const studentsAboveThresholdActivity = cos.reduce((acc, co) => {
//         // If threshold marks are 0, no student can score above the threshold
//         if (thresholdMarksActivity[co] === 0) {
//             acc[co] = 0;
//         } else {
//             // Count students who scored above the threshold for the CO
//             acc[co] = coWiseActivityMarks.filter(
//                 (student) => student.CO_ActivityMarks[co] >= thresholdMarksActivity[co]
//             ).length;
//         }
//         return acc;
//     }, {});
//     // console.log("students Above Threshold Activity:", studentsAboveThresholdActivity);

//     // Calculate the percentage of students above the threshold for each CO
//     const studentsAboveThresholdPercentageActivity = cos.reduce((acc, co) => {
//         acc[co] = totalStudents > 0
//             ? ((studentsAboveThresholdActivity[co] / totalStudents) * 100)
//             : 0; // Handle division by zero
//         return acc;
//     }, {});
//     // console.log("studentsAboveThresholdPercentageActivity:", studentsAboveThresholdPercentageActivity);


//     // Utility Functions
//     const calculateThresholdMarks = (coMarks, expectedThreshold, cos) => {
//         return cos.reduce((acc, co) => {
//             acc[co] = (coMarks.find((item) => item.name === co)?.totalMarks || 0) * (expectedThreshold / 100);
//             // console.log("Threshold Marks: ",acc);
//             return acc;
//         }, {});
//     };
//     // console.log("calculate Threshold Marks:", calculateThresholdMarks);
    

//     const countStudentsAboveThreshold = (coQuestionMarks, thresholdMarks, cos) => {
//         return cos.reduce((acc, co) => {
//             acc[co] = coQuestionMarks.filter(student => student.CO_QuestionMarks[co] >= thresholdMarks[co]).length;
//             // console.log("Students Above Threshold: ",acc);
//             return acc;
//         }, {});
//     };

//     // console.log("count Students Above Threshold:", countStudentsAboveThreshold);

//        // Calculate the weighted average for each CO
//        const weightedAveragePercentage = cos.reduce((acc, co) => {
//         if (isAssessment1 || isAssessment2) {
//             // Use weighted average for Assessment1 or Assessment2
//             if (studentsAboveThresholdPercentage[co] === 0) {
//                 acc[co] = studentsAboveThresholdPercentageActivity[co] * 1.0;
//             } else if (studentsAboveThresholdPercentageActivity[co] === 0) {
//                 acc[co] = studentsAboveThresholdPercentage[co] * 1.0;
//             } else {
//                 acc[co] = (0.6 * studentsAboveThresholdPercentage[co]) + (0.4 * studentsAboveThresholdPercentageActivity[co]);
//             }
//         } else if (formData?.Assessment_Type === "Lab_Assessment") {
//             // Specific logic for Lab_Assessment
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0; // Adjust as needed
//         } else if (formData?.Assessment_Type === "Lab_EndSem") {
//             // Specific logic for end-sem
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0; // Adjust as needed
//         } else if (formData?.Assessment_Type === "End_Sem") {
//             // Specific logic for Lab_End-sem
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0; // Adjust as needed
//         } else {
//             // Default logic for other assessment types
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0;
//         }
//         return acc;
//     }, {});

//     // console.log("weightedAveragePercentage:", weightedAveragePercentage);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (isSubmitting) return;
//         setIsSubmitting(true);

//         try {
//             // Calculate CO-wise marks for questions (Assessment)
//             const coQuestionMarks = calculateCOWiseQuestionMarks();

//             // Initialize coActivityMarks as null (for assessment types without activities)
//             let coActivityMarks = null;

//             // Calculate CO-wise marks for activities (only for Assessment1 and Assessment2)
//             if (isAssessment1 || isAssessment2) {
//                 coActivityMarks = calculateCOWiseActivityMarks();
//             }

//             // Calculate threshold marks
//             const thresholdMarks = calculateThresholdMarks(coMarks, expectedThreshold, cos);

//             // Count students above the threshold
//             const studentsAboveThreshold = countStudentsAboveThreshold(coQuestionMarks, thresholdMarks, cos);
//             setStudentsAboveThreshold(studentsAboveThreshold);

//             // Prepare the data to be submitted
//             const coData = {
//                 formData,
//                 students,
//                 coWiseMarks: {
//                     coQuestionMarks, // Include Assessment data
//                     coActivityMarks, // Include Activity data (if applicable)
//                 },
//                 weightedAveragePercentage,
//             };

//             // Log data for debugging
//             console.log("Form Data:", formData);
//             console.log("CO Data being sent to the backend:", coData);

//             // Submit the data to the backend
//             const response = await fetch('/auth/submit-co-data', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify(coData),
//             });

//             if (response.ok) {
//                 alert("CO & Marks Data submitted successfully!");
//             } else {
//                 alert("Failed to submit CO & Marks Data.");
//             }
//         } catch (error) {
//             console.error("Error submitting CO data:", error);
//             alert("An error occurred while submitting CO data.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Use the data as needed
//     // console.log("Form Data:", formData);
//     // console.log("Students:", students);
//     // console.log("Question Structure:", questionStructure);
//     // console.log("Expected Threshold:", expectedThreshold);

    
    
    

//     // Add a function to handle navigation to the CO Data Display page
//     const handleViewCOData = () => {
//         navigate('/co-data-display'); // Navigate to the CO Data Display page
//     };

//     return (
//         <>
//             <h2>CO Input System</h2>
//             <div className="layout-container">
//                 {/* Sidebar for Buttons */}
//                 <div className="sidebar">
//                 <div className="button-container">
//                     {/* Always render both buttons for Assessment and Activity */}
//                     <button className="toggle-btn" onClick={() => setInputMode("question")}>
//                         CO-Assessment
//                     </button>
//                     <button className="toggle-btn" onClick={() => setInputMode("activity")}>
//                         CO-Activity
//                     </button>
//                     <button onClick={handleViewCOData}>
//                         All CO Data
//                     </button>
//                 </div>
//                 <div className="toggle-buttons">
//                     <button onClick={() => setShowStudentMarks(!showStudentMarks)}>
//                         {showStudentMarks ? "Hide Student Marks" : "Student Marks"}
//                     </button>
//                     <button onClick={() => setShowCOWiseMarks(!showCOWiseMarks)}>
//                         {showCOWiseMarks ? "Hide CO-wise Marks" : "CO-wise Marks"}
//                     </button>
//                     <button onClick={() => setShowThresholdData(!showThresholdData)}>
//                         {showThresholdData ? "Hide Total CO" : "Total CO"}
//                     </button>
//                     <button onClick={() => setShowWeightedAveragePercentage(!showWeightedAveragePercentage)}>
//                         {showWeightedAveragePercentage ? "Hide CO(Combined)" : "CO(Combined)"}
//                     </button>
//                 </div>
//             </div>

//             <div className="main-content">
//                 {/* Always render Assessment input fields */}
//                 <div className="co-checkbox-container">
//                     <div className="co-checkbox">
//                         <div>
//                             <h3>Enter Assessment</h3>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>Q.No</th>
//                                         <th>Marks</th>
//                                         {cos.map((co) => (
//                                             <th key={co}>{co}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {questions.map(({ qNo }) => (
//                                         <tr key={qNo}>
//                                             <td>{qNo}</td>
//                                             <td>
//                                                 <select
//                                                     value={marks[qNo] || ""}
//                                                     onChange={(e) => handleMarksChange(qNo, e.target.value)}
//                                                 >
//                                                     <option value="">Select Marks</option>
//                                                     {[2, 12, 13, 15].map((mark) => (
//                                                         <option key={mark} value={mark}>
//                                                             {mark}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </td>
//                                             {cos.map((co) => (
//                                                 <td key={co} style={{ textAlign: "center" }}>
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={selected[qNo]?.[co] || false}
//                                                         onChange={() => handleCheckboxChange(qNo, co)}
//                                                     />
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Conditionally render Activity input fields only if assessmentType is Assessment1 or Assessment2 */}
//                 {(isAssessment1 || isAssessment2) && inputMode === "activity" && (
//                     <div className="co-checkbox-container">
//                         <div className="co-checkbox">
//                             <div>
//                                 <h3>Enter Number of Activities</h3>
//                                 <input
//                                     type="number"
//                                     value={activityCount}
//                                     onChange={(e) => handleActivityCountChange(e.target.value)}
//                                 />
//                                 <table border="1">
//                                     <thead>
//                                         <tr>
//                                             <th>Activity No</th>
//                                             <th>Marks</th>
//                                             {cos.map((co) => (
//                                                 <th key={co}>{co}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {activities.map((activity, index) => (
//                                             <tr key={index}>
//                                                 <td>{index + 1}</td>
//                                                 <td>
//                                                     <input
//                                                         type="number"
//                                                         value={activity.marks}
//                                                         onChange={(e) => handleActivityChange(index, "marks", e.target.value)}
//                                                     />
//                                                 </td>
//                                                 {cos.map((co) => (
//                                                     <td key={co}>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={activity.selectedCOs[co] || false}
//                                                             onChange={() => handleActivityChange(index, "selectedCOs", co)}
//                                                         />
//                                                     </td>
//                                                 ))}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Submit Button */}
//                 <button onClick={handleSubmit} disabled={isSubmitting}>
//                 {isSubmitting ? "Submitting..." : "Submit"}
//                 </button>

//                 {/* Result Sections */}
//                 {showStudentMarks && students && students.length > 0 && (
//                     <div>
//                         <h2>Student Marks</h2>
//                         <table border="1">
//                             <thead>
//                                 <tr>
//                                     <th>S No</th>
//                                     <th>Registration No</th>
//                                     {students[0]?.Marks.map((_, index) => (
//                                         <th key={index}>Q{index + 1}</th>
//                                     ))}
//                                     <th>Total</th>
//                                     {/* Conditionally render Activity columns if activities exist */}
//                                     {activities.length > 0 && students[0]?.Activities.map((_, index) => (
//                                         <th key={index}>Activity {index + 1}</th>
//                                     ))}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {students.map((student, index) => (
//                                     <tr key={index}>
//                                         <td>{student.SNo}</td>
//                                         <td>{student.RegNo}</td>
//                                         {student.Marks.map((mark, idx) => (
//                                             <td key={idx}>{mark}</td>
//                                         ))}
//                                         <td>{student.Total}</td>
//                                         {/* Conditionally render Activity marks if activities exist */}
//                                         {activities.length > 0 && student.Activities.map((activity, idx) => (
//                                             <td key={idx}>{activity}</td>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//                 {showCOWiseMarks && (
//                     <div>
//                         <h2>CO-wise Student Marks (Assessment and Activities)</h2>
//                         <table border="1">
//                             <thead>
//                                 <tr>
//                                     <th rowSpan="2">S No</th>
//                                     <th rowSpan="2">Registration No</th>
//                                     <th colSpan={cos.length}>CO-wise Assessment Marks</th>
//                                     {/* Conditionally render Activity Marks header if activities exist */}
//                                     {activities.length > 0 && (
//                                         <th colSpan={cos.length}>CO-wise Activity Marks</th>
//                                     )}
//                                 </tr>
//                                 <tr>
//                                     {/* Render Assessment CO headers */}
//                                     {cos.map(co => (
//                                         <th key={co}>{co}</th>
//                                     ))}
//                                     {/* Conditionally render Activity CO headers if activities exist */}
//                                     {activities.length > 0 &&
//                                         cos.map(co => (
//                                             <th key={co}>{co}</th>
//                                         ))
//                                     }
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {calculateCOWiseQuestionMarks().map((student, index) => {
//                                     const activityMarks = calculateCOWiseActivityMarks()[index];
//                                     return (
//                                         <tr key={index}>
//                                             <td>{student.SNo}</td>
//                                             <td>{student.RegNo}</td>
//                                             {/* Render Assessment Marks */}
//                                             {cos.map(co => (
//                                                 <td key={co}>{student.CO_QuestionMarks?.[co] || 0}</td>
//                                             ))}
//                                             {/* Conditionally render Activity Marks if activities exist */}
//                                             {activities.length > 0 &&
//                                                 cos.map(co => (
//                                                     <td key={co}>{activityMarks.CO_ActivityMarks?.[co] || 0}</td>
//                                                 ))
//                                             }
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//                         {showThresholdData && (
//                     <div>
//                         <h2>Students Total CO and Percentage</h2>
//                         <table border="1">
//                             <thead>
//                                 <tr>
//                                     <th>CO</th>
//                                     <th>Total CO (Assessment)</th>
//                                     <th>Total CO In Percentage (Assessment)</th>
//                                     {/* Conditionally render Activity columns if activity marks exist */}
//                                     {activities.length > 0 && (
//                                         <>
//                                             <th>Total CO (Activities)</th>
//                                             <th>Total CO In Percentage (Activities)</th>
//                                         </>
//                                     )}
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {cos.map(co => (
//                                     <tr key={co}>
//                                         <td>{co}</td>
//                                         <td>{thresholdMarks.find(t => t.name === co)?.threshold.toFixed(2)}</td>
//                                         <td>{studentsAboveThresholdPercentage[co].toFixed(2)}%</td>
//                                         {/* Conditionally render Activity data if activity marks exist */}
//                                         {activities.length > 0 && (
//                                             <>
//                                                 <td>{thresholdMarksActivity[co].toFixed(2)}</td>
//                                                 <td>{studentsAboveThresholdPercentageActivity[co].toFixed(2)}%</td>
//                                             </>
//                                         )}
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 )}
//                 {showWeightedAveragePercentage && (
//                         <div>
//                             <h2>CO(Assessment and Activity Combined)</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>CO</th>
//                                         <th>CO(Assessment and Activity Combined)</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cos.map(co => (
//                                         <tr key={co}>
//                                             <td>{co}</td>
//                                             <td>{weightedAveragePercentage[co].toFixed(2)}%</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default COInputPage;



// import { useState } from "react";
// import React from 'react';
// import { useLocation, useNavigate } from "react-router-dom";

// const COInputPage = () => {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const { formData, students, questionStructure, expectedThreshold } = location.state || {};
//     const totalStudents = students?.length || 0;
//     const cos = ["CO1", "CO2", "CO3", "CO4", "CO5"];
//     const [inputMode, setInputMode] = useState(null); // Default to null

//     // Define isAssessment1 and isAssessment2
//     const isAssessment1 = formData?.Assessment_Type === "Assessment1";
//     const isAssessment2 = formData?.Assessment_Type === "Assessment2";

//     // State variables to control visibility of each section
//     const [showStudentMarks, setShowStudentMarks] = useState(false);
//     const [showCOWiseMarks, setShowCOWiseMarks] = useState(false);
//     const [showThresholdData, setShowThresholdData] = useState(false);
//     const [showWeightedAveragePercentage, setShowWeightedAveragePercentage] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // Mapping of marks for each assessment type and part
//     const assessmentMarksMapping = {
//         Assessment1: { partA: { questionCount: 7, marks: 2 }, partB: { questionCount: 2, marks: 12 }, partC: { questionCount: 1, marks: 12 } },
//         Assessment2: { partA: { questionCount: 7, marks: 2 }, partB: { questionCount: 2, marks: 12 }, partC: { questionCount: 1, marks: 12 } },
//         Lab_Assessment: { partA: { questionCount: 3, marks: 2 } },
//         Lab_EndSem: { partA: { questionCount: 5, marks: 2 } },
//         End_Sem: { partA: { questionCount: 10, marks: 2 }, partB: { questionCount: 5, marks: 13 }, partC: { questionCount: 1, marks: 15 } },
//     };

//     // Flatten questions across parts (A, B, C) and assign marks based on assessment type
//     let questions = [];
//     let qNo = 1;
//     Object.entries(questionStructure).forEach(([part, count]) => {
//         const partMarks = assessmentMarksMapping[formData?.Assessment_Type]?.[part]?.marks || 0;
//         for (let i = 0; i < count; i++) {
//             questions.push({ qNo, part, marks: partMarks });
//             qNo++;
//         }
//     });

//     // Initialize state for checkboxes
//     const [selected, setSelected] = useState(
//         questions.reduce((acc, { qNo }) => {
//             acc[qNo] = cos.reduce((coAcc, co) => {
//                 coAcc[co] = false;
//                 return coAcc;
//             }, {});
//             return acc;
//         }, {})
//     );

//     // Initialize state for marks
//     const [marks, setMarks] = useState(
//         questions.reduce((acc, { qNo, marks }) => {
//             acc[qNo] = marks; // Use pre-defined marks
//             return acc;
//         }, {})
//     );

//     // Initialize state for studentsAboveThreshold
//     const [studentsAboveThreshold, setStudentsAboveThreshold] = useState({});

//     // Handle checkbox change
//     const handleCheckboxChange = (qNo, co) => {
//         setSelected((prev) => ({
//             ...prev,
//             [qNo]: { ...prev[qNo], [co]: !prev[qNo][co] }
//         }));
//     };

//     const [activityCount, setActivityCount] = useState(0);
//     const [activities, setActivities] = useState([]);

//     const handleActivityCountChange = (count) => {
//         setActivityCount(count);
//         setActivities(new Array(parseInt(count)).fill({ marks: 0, selectedCOs: {} }));
//     };

//     const handleActivityChange = (index, field, value) => {
//         setActivities(prev => {
//             const updated = [...prev];
//             if (field === "marks") {
//                 updated[index] = { ...updated[index], marks: parseInt(value) || 0 };
//             } else {
//                 updated[index] = {
//                     ...updated[index],
//                     selectedCOs: {
//                         ...updated[index].selectedCOs,
//                         [value]: !updated[index].selectedCOs[value] // Toggle checkbox state
//                     }
//                 };
//             }
//             return updated;
//         });
//     };

//     // Calculate CO-wise marks for questions
//     const calculateCOWiseQuestionMarks = () => {
//         return students?.map(student => {
//             let coWiseMarks = cos.reduce((acc, co) => {
//                 acc[co] = 0;
//                 return acc;
//             }, {});

//             student.Marks.forEach((mark, idx) => {
//                 let qNo = idx + 1; // Questions are 1-based index
//                 if (selected[qNo]) {
//                     cos.forEach(co => {
//                         if (selected[qNo][co]) {
//                             coWiseMarks[co] += mark;
//                         }
//                     });
//                 }
//             });

//             return {
//                 ...student,
//                 CO_QuestionMarks: coWiseMarks
//             };
//         });
//     };

//     // Calculate CO-wise marks for activities
//     const calculateCOWiseActivityMarks = () => {
//         const coActivityMarks = students?.map((student) => {
//             // Initialize CO-wise activity marks for the student
//             let coWiseActivityMarks = cos.reduce((acc, co) => {
//                 acc[co] = 0; // Initialize CO-wise activity marks to 0
//                 return acc;
//             }, {});

//             // Loop through activities and assign student's activity marks to the selected COs
//             activities.forEach((activity, activityIndex) => {
//                 const activityMarks = student.Activities[activityIndex]; // Get the student's marks for this activity

//                 cos.forEach((co) => {
//                     if (activity.selectedCOs[co]) {
//                         // Add the student's activity marks to the corresponding CO
//                         coWiseActivityMarks[co] += parseInt(activityMarks) || 0;
//                     }
//                 });
//             });

//             return {
//                 ...student,
//                 CO_ActivityMarks: coWiseActivityMarks, // Add CO-wise activity marks to the student object
//             };
//         });
//         return coActivityMarks;
//     };

//     // Convert selected data to count for each CO
//     const coCounts = cos.map(co => ({
//         name: co,
//         count: Object.values(selected).reduce((sum, q) => sum + (q[co] ? 1 : 0), 0)
//     }));

//     // Calculate total marks for each CO (based on questions only)
//     const coMarks = cos.map(co => ({
//         name: co,
//         totalMarks: Object.entries(selected).reduce((sum, [qNo, q]) => {
//             return sum + (q[co] ? (parseInt(marks[qNo]) || 0) : 0);
//         }, 0)
//     }));
//     console.log("Co marks ",coMarks);

//     const thresholdMarks = coMarks.map(co => ({
//         name: co.name,
//         threshold: co.totalMarks * (expectedThreshold / 100)
//     }));
//     console.log("Threshold marks ",thresholdMarks);
//     // Calculate the percentage of students above the threshold for each CO
//     const studentsAboveThresholdPercentage = cos.reduce((acc, co) => {
//         // Find threshold for the current CO
//         const coThresholdObj = thresholdMarks.find(item => item.name === co);
//         const threshold = coThresholdObj ? coThresholdObj.threshold : undefined;
    
//         console.log(`Processing CO: ${co}, Threshold: ${threshold}`);
    
//         if (threshold === undefined) {
//             acc[co] = 0; // If no threshold is found, assume 0%
//         } else if (threshold === 0) {
//             acc[co] = 0; // If threshold is 0, explicitly set 0%
//         } else {
//             const count = studentsAboveThreshold[co] || 0;
//             acc[co] = (totalStudents > 0 && count > 0)
//                 ? ((count / totalStudents) * 100)
//                 : 0;
//         }
    
//         console.log("Updated Threshold Calculation: ", acc);
//         return acc;
//     }, {});
    
    

//     const calculateTotalActivityMarksPerCO = () => {
//         // Initialize an object to store total activity marks for each CO
//         const totalActivityMarks = cos.reduce((acc, co) => {
//             acc[co] = 0; // Initialize each CO's total marks to 0
//             return acc;
//         }, {});

//         // Iterate through activities and add marks to the corresponding COs
//         activities.forEach((activity) => {
//             cos.forEach((co) => {
//                 if (activity.selectedCOs[co]) {
//                     // Add the activity marks to the corresponding CO
//                     totalActivityMarks[co] += parseInt(activity.marks) || 0;
//                 }
//             });
//         });

//         return totalActivityMarks;
//     };

//     // Calculate total activity marks for each CO
//     const totalActivityMarksPerCO = calculateTotalActivityMarksPerCO();

//     // Calculate threshold marks for each CO (based on activity marks only)
//     const thresholdMarksActivity = cos.reduce((acc, co) => {
//         acc[co] = (totalActivityMarksPerCO[co] || 0) * (expectedThreshold / 100);
//         return acc;
//     }, {});

//     // Calculate CO-wise activity marks for each student
//     const coWiseActivityMarks = calculateCOWiseActivityMarks();

//     // Count students who scored above the threshold for each CO
//     const studentsAboveThresholdActivity = cos.reduce((acc, co) => {
//         // If threshold marks are 0, no student can score above the threshold
//         if (thresholdMarksActivity[co] === 0) {
//             acc[co] = 0;
//         } else {
//             // Count students who scored above the threshold for the CO
//             acc[co] = coWiseActivityMarks.filter(
//                 (student) => student.CO_ActivityMarks[co] >= thresholdMarksActivity[co]
//             ).length;
//         }
//         return acc;
//     }, {});

//     // Calculate the percentage of students above the threshold for each CO
//     const studentsAboveThresholdPercentageActivity = cos.reduce((acc, co) => {
//         acc[co] = totalStudents > 0
//             ? ((studentsAboveThresholdActivity[co] / totalStudents) * 100)
//             : 0; // Handle division by zero
//         return acc;
//     }, {});

//     // Utility Functions
//     const calculateThresholdMarks = (coMarks, expectedThreshold, cos) => {
//         return cos.reduce((acc, co) => {
//             acc[co] = (coMarks.find((item) => item.name === co)?.totalMarks || 0) * (expectedThreshold / 100);
//             return acc;
//         }, {});
//     };

//     const countStudentsAboveThreshold = (coQuestionMarks, thresholdMarks, cos) => {
//         return cos.reduce((acc, co) => {
//             acc[co] = coQuestionMarks.filter(student => student.CO_QuestionMarks[co] >= thresholdMarks[co]).length;
//             return acc;
//         }, {});
//     };

//     // Calculate the weighted average for each CO
//     const weightedAveragePercentage = cos.reduce((acc, co) => {
//         if (isAssessment1 || isAssessment2) {
//             // Use weighted average for Assessment1 or Assessment2
//             if (studentsAboveThresholdPercentage[co] === 0) {
//                 acc[co] = studentsAboveThresholdPercentageActivity[co] * 1.0;
//             } else if (studentsAboveThresholdPercentageActivity[co] === 0) {
//                 acc[co] = studentsAboveThresholdPercentage[co] * 1.0;
//             } else {
//                 acc[co] = (0.6 * studentsAboveThresholdPercentage[co]) + (0.4 * studentsAboveThresholdPercentageActivity[co]);
//             }
//         } else if (formData?.Assessment_Type === "Lab_Assessment") {
//             // Specific logic for Lab_Assessment
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0; // Adjust as needed
//         } else if (formData?.Assessment_Type === "Lab_EndSem") {
//             // Specific logic for end-sem
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0; // Adjust as needed
//         } else if (formData?.Assessment_Type === "End_Sem") {
//             // Specific logic for Lab_End-sem
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0; // Adjust as needed
//         } else {
//             // Default logic for other assessment types
//             acc[co] = studentsAboveThresholdPercentage[co] * 1.0;
//         }
//         return acc;
//     }, {});

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (isSubmitting) return;
//         setIsSubmitting(true);

//         try {
//             // Calculate CO-wise marks for questions (Assessment)
//             const coQuestionMarks = calculateCOWiseQuestionMarks();

//             // Initialize coActivityMarks as null (for assessment types without activities)
//             let coActivityMarks = null;

//             // Calculate CO-wise marks for activities (only for Assessment1 and Assessment2)
//             if (isAssessment1 || isAssessment2) {
//                 coActivityMarks = calculateCOWiseActivityMarks();
//             }

//             // Calculate threshold marks
//             const thresholdMarks = calculateThresholdMarks(coMarks, expectedThreshold, cos);

//             // Count students above the threshold
//             const studentsAboveThreshold = countStudentsAboveThreshold(coQuestionMarks, thresholdMarks, cos);
//             setStudentsAboveThreshold(studentsAboveThreshold);

//             // Prepare the data to be submitted
//             const coData = {
//                 formData,
//                 students,
//                 coWiseMarks: {
//                     coQuestionMarks, // Include Assessment data
//                     coActivityMarks, // Include Activity data (if applicable)
//                 },
//                 weightedAveragePercentage,
//             };

//             // Log data for debugging
//             console.log("Form Data:", formData);
//             console.log("CO Data being sent to the backend:", coData);

//             // Submit the data to the backend
//             const response = await fetch('/auth/submit-co-data', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//                 body: JSON.stringify(coData),
//             });

//             if (response.ok) {
//                 alert("CO & Marks Data submitted successfully!");
//             } else {
//                 alert("Failed to submit CO & Marks Data.");
//             }
//         } catch (error) {
//             console.error("Error submitting CO data:", error);
//             alert("An error occurred while submitting CO data.");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // Add a function to handle navigation to the CO Data Display page
//     const handleViewCOData = () => {
//         navigate('/co-data-display'); // Navigate to the CO Data Display page
//     };

//     return (
//         <>
//             <h2>CO Input System</h2>
//             <div className="layout-container">
//                 {/* Sidebar for Buttons */}
//                 <div className="sidebar">
//                     <div className="button-container">
//                         {/* Always render both buttons for Assessment and Activity */}
//                         <button className="toggle-btn" onClick={() => setInputMode("question")}>
//                             CO-Assessment
//                         </button>
//                         <button className="toggle-btn" onClick={() => setInputMode("activity")}>
//                             CO-Activity
//                         </button>
//                         <button onClick={handleViewCOData}>
//                             All CO Data
//                         </button>
//                     </div>
//                     <div className="toggle-buttons">
//                         <button onClick={() => setShowStudentMarks(!showStudentMarks)}>
//                             {showStudentMarks ? "Hide Student Marks" : "Student Marks"}
//                         </button>
//                         <button onClick={() => setShowCOWiseMarks(!showCOWiseMarks)}>
//                             {showCOWiseMarks ? "Hide CO-wise Marks" : "CO-wise Marks"}
//                         </button>
//                         <button onClick={() => setShowThresholdData(!showThresholdData)}>
//                             {showThresholdData ? "Hide Total CO" : "Total CO"}
//                         </button>
//                         <button onClick={() => setShowWeightedAveragePercentage(!showWeightedAveragePercentage)}>
//                             {showWeightedAveragePercentage ? "Hide CO(Combined)" : "CO(Combined)"}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="main-content">
//                     {/* Always render Assessment input fields */}
//                     <div className="co-checkbox-container">
//                         <div className="co-checkbox">
//                             <div>
//                                 <h3>Enter Assessment</h3>
//                                 <table border="1">
//                                     <thead>
//                                         <tr>
//                                             <th>Q.No</th>
//                                             <th>Marks</th>
//                                             {cos.map((co) => (
//                                                 <th key={co}>{co}</th>
//                                             ))}
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {questions.map(({ qNo }) => (
//                                             <tr key={qNo}>
//                                                 <td>{qNo}</td>
//                                                 <td>
//                                                     {marks[qNo]} {/* Display pre-defined marks */}
//                                                 </td>
//                                                 {cos.map((co) => (
//                                                     <td key={co} style={{ textAlign: "center" }}>
//                                                         <input
//                                                             type="checkbox"
//                                                             checked={selected[qNo]?.[co] || false}
//                                                             onChange={() => handleCheckboxChange(qNo, co)}
//                                                         />
//                                                     </td>
//                                                 ))}
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Conditionally render Activity input fields only if assessmentType is Assessment1 or Assessment2 */}
//                     {(isAssessment1 || isAssessment2) && inputMode === "activity" && (
//                         <div className="co-checkbox-container">
//                             <div className="co-checkbox">
//                                 <div>
//                                     <h3>Enter Number of Activities</h3>
//                                     <input
//                                         type="number"
//                                         value={activityCount}
//                                         onChange={(e) => handleActivityCountChange(e.target.value)}
//                                     />
//                                     <table border="1">
//                                         <thead>
//                                             <tr>
//                                                 <th>Activity No</th>
//                                                 <th>Marks</th>
//                                                 {cos.map((co) => (
//                                                     <th key={co}>{co}</th>
//                                                 ))}
//                                             </tr>
//                                         </thead>
//                                         <tbody>
//                                             {activities.map((activity, index) => (
//                                                 <tr key={index}>
//                                                     <td>{index + 1}</td>
//                                                     <td>
//                                                         <input
//                                                             type="number"
//                                                             value={activity.marks}
//                                                             onChange={(e) => handleActivityChange(index, "marks", e.target.value)}
//                                                         />
//                                                     </td>
//                                                     {cos.map((co) => (
//                                                         <td key={co}>
//                                                             <input
//                                                                 type="checkbox"
//                                                                 checked={activity.selectedCOs[co] || false}
//                                                                 onChange={() => handleActivityChange(index, "selectedCOs", co)}
//                                                             />
//                                                         </td>
//                                                     ))}
//                                                 </tr>
//                                             ))}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Submit Button */}
//                     <button onClick={handleSubmit} disabled={isSubmitting}>
//                         {isSubmitting ? "Submitting..." : "Submit"}
//                     </button>

//                     {/* Result Sections */}
//                     {showStudentMarks && students && students.length > 0 && (
//                         <div>
//                             <h2>Student Marks</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>S No</th>
//                                         <th>Registration No</th>
//                                         {students[0]?.Marks.map((_, index) => (
//                                             <th key={index}>Q{index + 1}</th>
//                                         ))}
//                                         <th>Total</th>
//                                         {/* Conditionally render Activity columns if activities exist */}
//                                         {activities.length > 0 && students[0]?.Activities.map((_, index) => (
//                                             <th key={index}>Activity {index + 1}</th>
//                                         ))}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {students.map((student, index) => (
//                                         <tr key={index}>
//                                             <td>{student.SNo}</td>
//                                             <td>{student.RegNo}</td>
//                                             {student.Marks.map((mark, idx) => (
//                                                 <td key={idx}>{mark}</td>
//                                             ))}
//                                             <td>{student.Total}</td>
//                                             {/* Conditionally render Activity marks if activities exist */}
//                                             {activities.length > 0 && student.Activities.map((activity, idx) => (
//                                                 <td key={idx}>{activity}</td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                     {showCOWiseMarks && (
//                         <div>
//                             <h2>CO-wise Student Marks (Assessment and Activities)</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th rowSpan="2">S No</th>
//                                         <th rowSpan="2">Registration No</th>
//                                         <th colSpan={cos.length}>CO-wise Assessment Marks</th>
//                                         {/* Conditionally render Activity Marks header if activities exist */}
//                                         {activities.length > 0 && (
//                                             <th colSpan={cos.length}>CO-wise Activity Marks</th>
//                                         )}
//                                     </tr>
//                                     <tr>
//                                         {/* Render Assessment CO headers */}
//                                         {cos.map(co => (
//                                             <th key={co}>{co}</th>
//                                         ))}
//                                         {/* Conditionally render Activity CO headers if activities exist */}
//                                         {activities.length > 0 &&
//                                             cos.map(co => (
//                                                 <th key={co}>{co}</th>
//                                             ))
//                                         }
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {calculateCOWiseQuestionMarks().map((student, index) => {
//                                         const activityMarks = calculateCOWiseActivityMarks()[index];
//                                         return (
//                                             <tr key={index}>
//                                                 <td>{student.SNo}</td>
//                                                 <td>{student.RegNo}</td>
//                                                 {/* Render Assessment Marks */}
//                                                 {cos.map(co => (
//                                                     <td key={co}>{student.CO_QuestionMarks?.[co] || 0}</td>
//                                                 ))}
//                                                 {/* Conditionally render Activity Marks if activities exist */}
//                                                 {activities.length > 0 &&
//                                                     cos.map(co => (
//                                                         <td key={co}>{activityMarks.CO_ActivityMarks?.[co] || 0}</td>
//                                                     ))
//                                                 }
//                                             </tr>
//                                         );
//                                     })}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                     {showThresholdData && (
//                         <div>
//                             <h2>Students Total CO and Percentage</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>CO</th>
//                                         <th>Total CO (Assessment)</th>
//                                         <th>Total CO In Percentage (Assessment)</th>
//                                         {/* Conditionally render Activity columns if activity marks exist */}
//                                         {activities.length > 0 && (
//                                             <>
//                                                 <th>Total CO (Activities)</th>
//                                                 <th>Total CO In Percentage (Activities)</th>
//                                             </>
//                                         )}
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cos.map(co => (
//                                         <tr key={co}>
//                                             <td>{co}</td>
//                                             <td>{thresholdMarks.find(t => t.name === co)?.threshold.toFixed(2)}</td>
//                                             <td>{studentsAboveThresholdPercentage[co].toFixed(2)}%</td>
//                                             {/* Conditionally render Activity data if activity marks exist */}
//                                             {activities.length > 0 && (
//                                                 <>
//                                                     <td>{thresholdMarksActivity[co].toFixed(2)}</td>
//                                                     <td>{studentsAboveThresholdPercentageActivity[co].toFixed(2)}%</td>
//                                                 </>
//                                             )}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                     {showWeightedAveragePercentage && (
//                         <div>
//                             <h2>CO(Assessment and Activity Combined)</h2>
//                             <table border="1">
//                                 <thead>
//                                     <tr>
//                                         <th>CO</th>
//                                         <th>CO(Assessment and Activity Combined)</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {cos.map(co => (
//                                         <tr key={co}>
//                                             <td>{co}</td>
//                                             <td>{weightedAveragePercentage[co].toFixed(2)}%</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };
// export default COInputPage;




import { useState, useEffect } from "react";
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom"; // Ensure useNavigate is imported

const COInputPage = () => {
    const location = useLocation();
    const navigate = useNavigate(); // Initialize navigate using useNavigate
    const { formData, students, questionStructure, expectedThreshold } = location.state || {};
    const totalStudents = students?.length || 0;
    const cos = ["CO1", "CO2", "CO3", "CO4", "CO5"];
    const [inputMode, setInputMode] = useState(null);

    const isAssessment1 = formData?.Assessment_Type === "Assessment1";
    const isAssessment2 = formData?.Assessment_Type === "Assessment2";

    const [showStudentMarks, setShowStudentMarks] = useState(false);
    const [showCOWiseMarks, setShowCOWiseMarks] = useState(false);
    const [showThresholdData, setShowThresholdData] = useState(false);
    const [showWeightedAveragePercentage, setShowWeightedAveragePercentage] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const assessmentMarksMapping = {
        Assessment1: { partA: { questionCount: 7, marks: 2 }, partB: { questionCount: 2, marks: 12 }, partC: { questionCount: 1, marks: 12 } },
        Assessment2: { partA: { questionCount: 7, marks: 2 }, partB: { questionCount: 2, marks: 12 }, partC: { questionCount: 1, marks: 12 } },
        Lab_Assessment: { partA: { questionCount: 3, marks: 2 } },
        Lab_EndSem: { partA: { questionCount: 5, marks: 2 } },
        End_Sem: { partA: { questionCount: 10, marks: 2 }, partB: { questionCount: 5, marks: 13 }, partC: { questionCount: 1, marks: 15 } },
    };

    let questions = [];
    let qNo = 1;
    Object.entries(questionStructure).forEach(([part, count]) => {
        const partMarks = assessmentMarksMapping[formData?.Assessment_Type]?.[part]?.marks || 0;
        for (let i = 0; i < count; i++) {
            questions.push({ qNo, part, marks: partMarks });
            qNo++;
        }
    });

    const [selected, setSelected] = useState(
        questions.reduce((acc, { qNo }) => {
            acc[qNo] = cos.reduce((coAcc, co) => {
                coAcc[co] = false;
                return coAcc;
            }, {});
            return acc;
        }, {})
    );

    const [marks, setMarks] = useState(
        questions.reduce((acc, { qNo, marks }) => {
            acc[qNo] = marks;
            return acc;
        }, {})
    );

    const [studentsAboveThreshold, setStudentsAboveThreshold] = useState({});

    const handleCheckboxChange = (qNo, co) => {
        setSelected((prev) => ({
            ...prev,
            [qNo]: { ...prev[qNo], [co]: !prev[qNo][co] }
        }));
    };

    const [activityCount, setActivityCount] = useState(0);
    const [activities, setActivities] = useState([]);

    const handleActivityCountChange = (count) => {
        setActivityCount(count);
        setActivities(new Array(parseInt(count)).fill({ marks: 0, selectedCOs: {} }));
    };

    const handleActivityChange = (index, field, value) => {
        setActivities(prev => {
            const updated = [...prev];
            if (field === "marks") {
                updated[index] = { ...updated[index], marks: parseInt(value) || 0 };
            } else {
                updated[index] = {
                    ...updated[index],
                    selectedCOs: {
                        ...updated[index].selectedCOs,
                        [value]: !updated[index].selectedCOs[value]
                    }
                };
            }
            return updated;
        });
    };

    // Define calculateCOWiseQuestionMarks function
    const calculateCOWiseQuestionMarks = () => {
        return students?.map(student => {
            let coWiseMarks = cos.reduce((acc, co) => {
                acc[co] = 0;
                return acc;
            }, {});

            student.Marks.forEach((mark, idx) => {
                let qNo = idx + 1; // Questions are 1-based index
                if (selected[qNo]) {
                    cos.forEach(co => {
                        if (selected[qNo][co]) {
                            coWiseMarks[co] += mark;
                        }
                    });
                }
            });

            return {
                ...student,
                CO_QuestionMarks: coWiseMarks
            };
        });
    };

    // Calculate CO-wise marks for activities
    const calculateCOWiseActivityMarks = () => {
        const coActivityMarks = students?.map((student) => {
            // Initialize CO-wise activity marks for the student
            let coWiseActivityMarks = cos.reduce((acc, co) => {
                acc[co] = 0; // Initialize CO-wise activity marks to 0
                return acc;
            }, {});

            // Loop through activities and assign student's activity marks to the selected COs
            activities.forEach((activity, activityIndex) => {
                const activityMarks = student.Activities[activityIndex]; // Get the student's marks for this activity

                cos.forEach((co) => {
                    if (activity.selectedCOs[co]) {
                        // Add the student's activity marks to the corresponding CO
                        coWiseActivityMarks[co] += parseInt(activityMarks) || 0;
                    }
                });
            });

            return {
                ...student,
                CO_ActivityMarks: coWiseActivityMarks, // Add CO-wise activity marks to the student object
            };
        });
        return coActivityMarks;
    };

    // Define calculateTotalActivityMarksPerCO function
    const calculateTotalActivityMarksPerCO = () => {
        const totalActivityMarks = cos.reduce((acc, co) => {
            acc[co] = 0; // Initialize each CO's total marks to 0
            return acc;
        }, {});

        // Iterate through activities and add marks to the corresponding COs
        activities.forEach((activity) => {
            cos.forEach((co) => {
                if (activity.selectedCOs[co]) {
                    // Add the activity marks to the corresponding CO
                    totalActivityMarks[co] += parseInt(activity.marks) || 0;
                }
            });
        });

        return totalActivityMarks;
    };

    // Define calculateThresholdMarks function
    const calculateThresholdMarks = (coMarks, expectedThreshold, cos) => {
        return cos.reduce((acc, co) => {
            acc[co] = (coMarks.find((item) => item.name === co)?.totalMarks || 0) * (expectedThreshold / 100);
            // console.log("Threshold ",acc);
            return acc;
        }, {});
    };

    const countStudentsAboveThreshold = (coQuestionMarks, thresholdMarks, cos) => {
        return cos.reduce((acc, co) => {
            // Access the threshold for the current CO directly from the object
            const threshold = thresholdMarks[co];
    
            console.log(`Processing CO: ${co}, Threshold: ${threshold}`);
    
            if (threshold === undefined) {
                acc[co] = 0; // If no threshold is found, assume 0 students
            } else if (threshold === 0) {
                acc[co] = 0; // If threshold is 0, explicitly set 0 students
            } else {
                // Calculate the count of students above the threshold
                const count = coQuestionMarks.filter(student => student.CO_QuestionMarks[co] >= threshold).length;
                acc[co] = count === 0 ? 0 : count;
            }
    
            console.log("Updated Threshold Calculation: ", acc);
            return acc;
        }, {});
    };
    // console.log("Threshold ",countStudentsAboveThreshold);
    // State to store calculated values
    const [coQuestionMarks, setCoQuestionMarks] = useState([]);
    const [coActivityMarks, setCoActivityMarks] = useState([]);
    const [coMarks, setCoMarks] = useState([]);
    const [thresholdMarks, setThresholdMarks] = useState({});
    const [studentsAboveThresholdPercentage, setStudentsAboveThresholdPercentage] = useState({});
    const [studentsAboveThresholdActivity, setStudentsAboveThresholdActivity] = useState({});
    const [studentsAboveThresholdPercentageActivity, setStudentsAboveThresholdPercentageActivity] = useState({});
    const [weightedAveragePercentage, setWeightedAveragePercentage] = useState({});
    const [totalActivityMarksPerCO, setTotalActivityMarksPerCO] = useState({});
    const [thresholdMarksActivity, setThresholdMarksActivity] = useState({});

    // Calculate coMarks
    useEffect(() => {
        const calculatedCoMarks = cos.map(co => ({
            name: co,
            totalMarks: Object.entries(selected).reduce((sum, [qNo, q]) => {
                return sum + (q[co] ? (parseInt(marks[qNo]) || 0) : 0);
            }, 0)
        }));
        setCoMarks(calculatedCoMarks);
    }, [selected, marks]);

    // Calculate CO-wise marks for questions
    useEffect(() => {
        const calculatedCoQuestionMarks = calculateCOWiseQuestionMarks();
        setCoQuestionMarks(calculatedCoQuestionMarks);
    }, [selected, students]);

    // Calculate CO-wise marks for activities
    useEffect(() => {
        if (isAssessment1 || isAssessment2) {
            const calculatedCoActivityMarks = calculateCOWiseActivityMarks();
            setCoActivityMarks(calculatedCoActivityMarks);
        }
    }, [activities, students]);


useEffect(() => {
    const calculatedTotalActivityMarksPerCO = calculateTotalActivityMarksPerCO();
    console.log("Calculated Total Activity Marks per CO:", calculatedTotalActivityMarksPerCO); // Debug
    setTotalActivityMarksPerCO(calculatedTotalActivityMarksPerCO);
}, [activities]);

// Calculate threshold marks for activities
useEffect(() => {
    console.log("Total Activity Marks per CO (in threshold calculation):", totalActivityMarksPerCO); // Debug
    console.log("Expected Threshold:", expectedThreshold); // Debug

    const calculatedThresholdMarksActivity = cos.reduce((acc, co) => {
        const totalMarksForCO = totalActivityMarksPerCO[co] || 0;
        console.log(`Processing CO: ${co}, Total Marks: ${totalMarksForCO}`); // Debug

        // If total marks for the CO is 0, set threshold to 0
        if (totalMarksForCO === 0) {
            acc[co] = 0;
        } else {
            // Otherwise, calculate the threshold marks
            acc[co] = totalMarksForCO * (expectedThreshold / 100);
        }

        console.log(`Threshold Marks for ${co}:`, acc[co]); // Debug
        return acc;
    }, {});

    console.log("Calculated Threshold Marks for Activities:", calculatedThresholdMarksActivity); // Debug
    setThresholdMarksActivity(calculatedThresholdMarksActivity);
}, [totalActivityMarksPerCO, expectedThreshold]);

    // Calculate threshold marks
    useEffect(() => {
        const calculatedThresholdMarks = calculateThresholdMarks(coMarks, expectedThreshold, cos);
        setThresholdMarks(calculatedThresholdMarks);
    }, [coMarks, expectedThreshold]);

    // Calculate students above threshold percentage
    useEffect(() => {
        const calculatedStudentsAboveThreshold = countStudentsAboveThreshold(coQuestionMarks, thresholdMarks, cos);
        setStudentsAboveThreshold(calculatedStudentsAboveThreshold);

        const percentage = cos.reduce((acc, co) => {
            acc[co] = totalStudents > 0
                ? ((calculatedStudentsAboveThreshold[co] / totalStudents) * 100)
                : 0;
            return acc;
        }, {});
        setStudentsAboveThresholdPercentage(percentage);
    }, [coQuestionMarks, thresholdMarks, totalStudents]);

    // Calculate students above threshold for activities
    useEffect(() => {
        const calculatedStudentsAboveThresholdActivity = cos.reduce((acc, co) => {
            acc[co] = coActivityMarks.filter(
                (student) => student.CO_ActivityMarks[co] >= thresholdMarksActivity[co]
            ).length;
            return acc;
        }, {});
        setStudentsAboveThresholdActivity(calculatedStudentsAboveThresholdActivity);
    }, [coActivityMarks, thresholdMarksActivity]);

    // Calculate students above threshold percentage for activities
    useEffect(() => {
        const percentage = cos.reduce((acc, co) => {
            // If thresholdMarksActivity for the CO is 0, set percentage to 0
            if (thresholdMarksActivity[co] === 0) {
                acc[co] = 0;
            } else {
                // Otherwise, calculate the percentage
                acc[co] = totalStudents > 0
                    ? ((studentsAboveThresholdActivity[co] / totalStudents) * 100)
                    : 0;
            }
            return acc;
        }, {});

    setStudentsAboveThresholdPercentageActivity(percentage);
}, [studentsAboveThresholdActivity, totalStudents, thresholdMarksActivity]);

    // Calculate weighted average percentage
    useEffect(() => {
        const weightedAverage = cos.reduce((acc, co) => {
            if (isAssessment1 || isAssessment2) {
                acc[co] = (0.6 * studentsAboveThresholdPercentage[co]) + (0.4 * studentsAboveThresholdPercentageActivity[co]);
            } else {
                acc[co] = studentsAboveThresholdPercentage[co];
            }
            return acc;
        }, {});
        setWeightedAveragePercentage(weightedAverage);
    }, [studentsAboveThresholdPercentage, studentsAboveThresholdPercentageActivity]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            // Prepare the data to be submitted
            const coData = {
                formData,
                students,
                coWiseMarks: {
                    coQuestionMarks,
                    coActivityMarks,
                },
                weightedAveragePercentage,
            };

            console.log("Form Data:", formData);
            console.log("CO Data being sent to the backend:", coData);

            const response = await fetch('/auth/submit-co-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(coData),
            });

            if (response.ok) {
                alert("CO & Marks Data submitted successfully!");
            } else {
                alert("Failed to submit CO & Marks Data.");
            }
        } catch (error) {
            console.error("Error submitting CO data:", error);
            alert("An error occurred while submitting CO data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleViewCOData = () => {
        navigate('/co-data-display'); // Navigate to the CO Data Display page
    };


    return (
        <>
            <h2>CO Input System</h2>
            <div className="layout-container">
                <div className="sidebar">
                    <div className="button-container">
                        <button className="toggle-btn" onClick={() => setInputMode("question")}>
                            CO-Assessment
                        </button>
                        <button className="toggle-btn" onClick={() => setInputMode("activity")}>
                            CO-Activity
                        </button>
                        <button onClick={handleViewCOData}>
                            All CO Data
                        </button>
                    </div>
                    <div className="toggle-buttons">
                        <button onClick={() => setShowStudentMarks(!showStudentMarks)}>
                            {showStudentMarks ? "Hide Student Marks" : "Student Marks"}
                        </button>
                        <button onClick={() => setShowCOWiseMarks(!showCOWiseMarks)}>
                            {showCOWiseMarks ? "Hide CO-wise Marks" : "CO-wise Marks"}
                        </button>
                        <button onClick={() => setShowThresholdData(!showThresholdData)}>
                            {showThresholdData ? "Hide Total CO" : "Total CO"}
                        </button>
                        <button onClick={() => setShowWeightedAveragePercentage(!showWeightedAveragePercentage)}>
                            {showWeightedAveragePercentage ? "Hide CO(Combined)" : "CO(Combined)"}
                        </button>
                    </div>
                </div>

                <div className="main-content">
                    <div className="co-checkbox-container">
                        <div className="co-checkbox">
                            <div>
                                <h3>Enter Assessment</h3>
                                <table border="1">
                                    <thead>
                                        <tr>
                                            <th>Q.No</th>
                                            <th>Marks</th>
                                            {cos.map((co) => (
                                                <th key={co}>{co}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions.map(({ qNo }) => (
                                            <tr key={qNo}>
                                                <td>{qNo}</td>
                                                <td>{marks[qNo]}</td>
                                                {cos.map((co) => (
                                                    <td key={co} style={{ textAlign: "center" }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={selected[qNo]?.[co] || false}
                                                            onChange={() => handleCheckboxChange(qNo, co)}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {(isAssessment1 || isAssessment2) && inputMode === "activity" && (
                        <div className="co-checkbox-container">
                            <div className="co-checkbox">
                                <div>
                                    <h3>Enter Number of Activities</h3>
                                    <input
                                        type="number"
                                        value={activityCount}
                                        onChange={(e) => handleActivityCountChange(e.target.value)}
                                    />
                                    <table border="1">
                                        <thead>
                                            <tr>
                                                <th>Activity No</th>
                                                <th>Marks</th>
                                                {cos.map((co) => (
                                                    <th key={co}>{co}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {activities.map((activity, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            value={activity.marks}
                                                            onChange={(e) => handleActivityChange(index, "marks", e.target.value)}
                                                        />
                                                    </td>
                                                    {cos.map((co) => (
                                                        <td key={co}>
                                                            <input
                                                                type="checkbox"
                                                                checked={activity.selectedCOs[co] || false}
                                                                onChange={() => handleActivityChange(index, "selectedCOs", co)}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    <button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>

                    {showStudentMarks && students && students.length > 0 && (
                        <div>
                            <h2>Student Marks</h2>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>S No</th>
                                        <th>Registration No</th>
                                        {students[0]?.Marks.map((_, index) => (
                                            <th key={index}>Q{index + 1}</th>
                                        ))}
                                        <th>Total</th>
                                        {activities.length > 0 && students[0]?.Activities.map((_, index) => (
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
                                            {activities.length > 0 && student.Activities.map((activity, idx) => (
                                                <td key={idx}>{activity}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {showCOWiseMarks && (
                        <div>
                            <h2>CO-wise Student Marks (Assessment and Activities)</h2>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th rowSpan="2">S No</th>
                                        <th rowSpan="2">Registration No</th>
                                        <th colSpan={cos.length}>CO-wise Assessment Marks</th>
                                        {activities.length > 0 && (
                                            <th colSpan={cos.length}>CO-wise Activity Marks</th>
                                        )}
                                    </tr>
                                    <tr>
                                        {cos.map(co => (
                                            <th key={co}>{co}</th>
                                        ))}
                                        {activities.length > 0 &&
                                            cos.map(co => (
                                                <th key={co}>{co}</th>
                                            ))
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {coQuestionMarks.map((student, index) => {
                                        const activityMarks = coActivityMarks[index];
                                        return (
                                            <tr key={index}>
                                                <td>{student.SNo}</td>
                                                <td>{student.RegNo}</td>
                                                {cos.map(co => (
                                                    <td key={co}>{student.CO_QuestionMarks?.[co] || 0}</td>
                                                ))}
                                                {activities.length > 0 &&
                                                    cos.map(co => (
                                                        <td key={co}>{activityMarks.CO_ActivityMarks?.[co] || 0}</td>
                                                    ))
                                                }
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {showThresholdData && (
                        <div>
                            <h2>Students Total CO and Percentage</h2>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>CO</th>
                                        <th>Total CO (Assessment)</th>
                                        <th>Total CO In Percentage (Assessment)</th>
                                        {activities.length > 0 && (
                                            <>
                                                <th>Total CO (Activities)</th>
                                                <th>Total CO In Percentage (Activities)</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cos.map(co => (
                                        <tr key={co}>
                                            <td>{co}</td>
                                            <td>{thresholdMarks[co]?.toFixed(2)}</td>
                                            <td>{studentsAboveThresholdPercentage[co]?.toFixed(2)}%</td>
                                            {activities.length > 0 && (
                                                <>
                                                    <td>{thresholdMarksActivity[co]?.toFixed(2)}</td>
                                                    <td>{studentsAboveThresholdPercentageActivity[co]?.toFixed(2)}%</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {showWeightedAveragePercentage && (
                        <div>
                            <h2>CO(Assessment and Activity Combined)</h2>
                            <table border="1">
                                <thead>
                                    <tr>
                                        <th>CO</th>
                                        <th>CO(Assessment and Activity Combined)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cos.map(co => (
                                        <tr key={co}>
                                            <td>{co}</td>
                                            <td>{weightedAveragePercentage[co]?.toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default COInputPage;





 