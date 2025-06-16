import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FiUser, FiMail, FiLock, FiSun, FiMoon } from 'react-icons/fi';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name must contain only letters and spaces';
    }
    if (!/^[^\s@]+@(gmail\.com|ambak\.com)$/.test(email.trim())) {
      newErrors.email = 'Email must be from gmail.com or ambak.com';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
      });

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'Account created successfully',
        background: darkMode ? '#1e293b' : '#f0fdf4',
        iconColor: '#22c55e',
        confirmButtonColor: '#22c55e',
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Registration failed. Try again.',
        background: darkMode ? '#1f2937' : '#fef2f2',
        iconColor: '#ef4444',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 dark:from-gray-900 dark:to-gray-800 transition-all duration-500 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 dark:bg-white/5 backdrop-blur-md text-white dark:text-white p-8 rounded-2xl shadow-xl max-w-md w-full space-y-6 border border-white/20 animate-fade-in"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold">📝 Register</h2>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="text-xl hover:text-yellow-400 transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          <div>
            <label className="block mb-1">Name</label>
            <div className="flex items-center bg-white/20 dark:bg-white/10 rounded-lg px-3 py-2">
              <FiUser className="mr-2" />
              <input
                type="text"
                placeholder="Full name"
                className="bg-transparent flex-1 placeholder-gray-300 text-white outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && <p className="text-red-300 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <div className="flex items-center bg-white/20 dark:bg-white/10 rounded-lg px-3 py-2">
              <FiMail className="mr-2" />
              <input
                type="email"
                placeholder="you@gmail.com"
                className="bg-transparent flex-1 placeholder-gray-300 text-white outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <div className="flex items-center bg-white/20 dark:bg-white/10 rounded-lg px-3 py-2">
              <FiLock className="mr-2" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                className="bg-transparent flex-1 placeholder-gray-300 text-white outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition duration-300"
          >
            Register
          </button>

          <p className="text-center text-white/80">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-300 hover:underline font-semibold">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
