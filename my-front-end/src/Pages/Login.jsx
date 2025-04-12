import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Components/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [signupCredentials, setSignupCredentials] = useState({ 
    Name: "", 
    Username: "", 
    Password: "", 
    Phone: "", 
    Email: "",
    location: "" 
  });
  
  const [loginCredentials, setLoginCredentials] = useState({ 
    Username: "", 
    Password: "" 
  });

  const handleSubmit = async (e, isSignup) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await axios.post(`${apiUrl}/api/createAccount`, signupCredentials,{
          withCredentials: true // This is crucial
        });
        setIsSignup(false);
        alert('Signup successful! Please login.');
      } else {
        await login(loginCredentials);
        navigate('/');
      }
    } catch (error) {
      alert(error.response?.data?.errors?.[0]?.msg || 'An error occurred');
    }
  };


 

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className={`relative bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden transition-all duration-500 ${isSignup ? 'h-[650px]' : 'h-[500px]'}`}>
        
        {/* Signup Form */}
        <div className={`absolute w-1/2 left-0 top-0 h-full bg-white transition-all duration-500 ${isSignup ? 'translate-x-full opacity-100' : 'opacity-0'}`}>
          <div className="p-8 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">Sign Up</h2>
            <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
              {['Name', 'Email', 'Phone', 'Username', 'Password'].map((field) => (
                <div key={field} className="flex items-center bg-orange-50 rounded-lg p-3">
                  <FontAwesomeIcon 
                    icon={
                      field === 'Name' ? faUser :
                      field === 'Email' ? faEnvelope :
                      field === 'Phone' ? faPhone :
                      field === 'Username' ? faUser : faLock
                    } 
                    className="text-orange-500 mr-3"
                  />
                  <input
                    type={field === 'Password' ? 'password' : 'text'}
                    name={field}
                    placeholder={field}
                    value={signupCredentials[field]}
                    onChange={(e) => setSignupCredentials({ ...signupCredentials, [field]: e.target.value })}
                    className="w-full bg-transparent outline-none"
                    required
                  />
                </div>
              ))}
              <div className="flex items-center bg-orange-50 rounded-lg p-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-500 mr-3" />
                <input
                  type="text"
                  value={signupCredentials.location}
                  readOnly
                  placeholder="Detected location"
                  className="w-full bg-transparent outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition">
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* Login Form */}
        <div className={`absolute w-1/2 left-0 top-0 h-full bg-white transition-all duration-500 `}>
          <div className="p-8 h-full flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">Welcome Back!</h2>
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              {['Username', 'Password'].map((field) => (
                <div key={field} className="flex items-center bg-orange-50 rounded-lg p-3">
                  <FontAwesomeIcon 
                    icon={field === 'Username' ? faUser : faLock} 
                    className="text-orange-500 mr-3"
                  />
                  <input
                    type={field === 'Password' ? 'password' : 'text'}
                    name={field}
                    placeholder={field}
                    value={loginCredentials[field]}
                    onChange={(e) => setLoginCredentials({ ...loginCredentials, [field]: e.target.value })}
                    className="w-full bg-transparent outline-none"
                    required
                  />
                </div>
              ))}
              <button type="submit" className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition">
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* Overlay */}
        <div className={`absolute w-1/2 h-full top-0 left-1/2 overflow-hidden transition-all duration-500 ${isSignup ? '-translate-x-full' : ''}`}>
          <div className="relative h-full w-full bg-gradient-to-br from-orange-400 to-orange-600 text-white p-8 flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold mb-4">
              {isSignup ? 'Already Have an Account?' : 'New Here?'}
            </h2>
            <p className="mb-8 text-center">
              {isSignup ? 'Sign in to manage your food donations' : 'Create an account to start sharing food'}
            </p>
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="border-2 border-white px-8 py-3 rounded-full hover:bg-white hover:text-orange-600 transition"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;