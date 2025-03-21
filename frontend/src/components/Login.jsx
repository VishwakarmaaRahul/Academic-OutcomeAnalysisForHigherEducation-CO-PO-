import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import './AuthStyles.css';

const Login = ({ onLoginSuccess }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await loginUser(credentials);
    if (response.success) {
      onLoginSuccess(response.user);
      navigate(`/${response.user.role}-profile`);
    } else {
      setError(response.message);
    }
  };

  return (
    <> 
      <h1 className="site-title">Academic Outcome Analysis</h1>
      <div className="auth-container">
      
      <div className="auth-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="username" value={credentials.username} onChange={handleChange} placeholder="Username" required />
          <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" required />
          <button type="submit" className="auth-button">Log In</button>
        </form>
        <p className="auth-link">Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
    </>
  );
};

export default Login;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { loginUser } from '../api/auth';
// import './AuthStyles.css';

// const Login = ({ onLoginSuccess }) => {
//   const [credentials, setCredentials] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setCredentials({ ...credentials, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await loginUser(credentials);
//     if (response.success) {
//       onLoginSuccess(response.user);
//       navigate(`/${response.user.role}-profile`); // Redirect to role-specific profile
//     } else {
//       setError(response.message);
//     }
//   };

//   return (
//     <>
//       <h1 className="site-title">Academic Outcome Analysis</h1>
//       <div className="auth-container">
//         <div className="auth-form">
//           <h2>Login</h2>
//           {error && <p className="error-message">{error}</p>}
//           <form onSubmit={handleSubmit}>
//             <input
//               type="text"
//               name="username"
//               value={credentials.username}
//               onChange={handleChange}
//               placeholder="Username"
//               required
//             />
//             <input
//               type="password"
//               name="password"
//               value={credentials.password}
//               onChange={handleChange}
//               placeholder="Password"
//               required
//             />
//             <button type="submit" className="auth-button">
//               Log In
//             </button>
//           </form>
//           <p className="auth-link">
//             Don't have an account? <a href="/signup">Sign Up</a>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Login;