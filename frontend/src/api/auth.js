import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Flask backend URL


export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Signup failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user details
    }
    return { success: true, user: response.data.user };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// export const loginUser = async (credentials) => {
//   const response = await fetch('/auth/login', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(credentials),
//   });
//   return response.json();
// };

// export const createFacultyUser = async (formData) => {
//   const response = await fetch('/auth/admin/create-faculty', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${localStorage.getItem('token')}`,
//     },
//     body: JSON.stringify(formData),
//   });
//   return response.json();
// };