import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api/auth';
import './AuthStyles.css';

const Signup = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'faculty',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      const response = await signupUser(formData);
      if (response.success) {
        setSuccessMessage('User registered successfully!');
        setError('');
        onSignupSuccess(response.user);
        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(response.message || 'Signup failed.');
        setSuccessMessage('');
      }
    } catch (err) {
      setError('Failed to sign up. Please try again later.');
    }
  };

  return (
    <>
    <h1 className="site-title-signup">Academic Outcome Analysis</h1>
    <div className="auth-container">
      <div className="auth-form">
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="auth-button">Sign Up</button>
        </form>
        <p className="auth-link">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
    </>
  );
};

export default Signup;



// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { createFacultyUser } from '../api/auth';
// import './AuthStyles.css';

// const Signup = ({ onFacultyCreationSuccess }) => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await createFacultyUser(formData);
//       if (response.success) {
//         setSuccessMessage('Faculty user created successfully!');
//         setError('');
//         onFacultyCreationSuccess(response.user);
//         setTimeout(() => navigate('/admin-dashboard'), 1500); // Redirect to admin dashboard
//       } else {
//         setError(response.message || 'Faculty creation failed.');
//         setSuccessMessage('');
//       }
//     } catch (err) {
//       setError('Failed to create faculty user. Please try again later.');
//     }
//   };

//   return (
//     <>
//       <h1 className="site-title-signup">Academic Outcome Analysis</h1>
//       <div className="auth-container">
//         <div className="auth-form">
//           <h2>Create Faculty User</h2>
//           {error && <p className="error-message">{error}</p>}
//           {successMessage && <p className="success-message">{successMessage}</p>}
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               placeholder="Username"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//             />
//             <button type="submit" className="auth-button">
//               Create Faculty
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Signup;