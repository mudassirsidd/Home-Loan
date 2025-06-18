import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiSun, FiMoon } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) return saved === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const { access_token, user } = res.data;
      localStorage.setItem("token", access_token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);

      Swal.fire({
        icon: "success",
        title: "Welcome back!",
        text: `Hello, ${user.name}`,
        background: darkMode ? "#1f2937" : "#f0f9ff",
        iconColor: "#10b981",
        confirmButtonColor: "#059669",
        timer: 1800,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-xl shadow-md",
        },
      });

      setTimeout(() => {
        window.location.href = user.role === "admin" ? "/admin" : "/user";
      }, 1500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid credentials or server error.",
        background: darkMode ? "#374151" : "#fef2f2",
        iconColor: "#ef4444",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-500
        ${
          darkMode
            ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
            : "bg-gradient-to-tr from-indigo-300 via-purple-200 to-pink-300"
        }`}
    >
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md shadow-lg bg-white/10 dark:bg-white/20 text-white hover:scale-105 transition"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>
  
      <form
        onSubmit={handleLogin}
        className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/20 dark:bg-black/30
          ${darkMode ? "text-white" : "text-gray-900"} space-y-6 transition-colors duration-500`}
      >
        <h2 className="text-4xl font-extrabold text-center tracking-tight">
          Welcome Back 👋
        </h2>
  
        <div>
          <label className="block mb-2 font-semibold text-sm">Email</label>
          <div className={`flex items-center px-4 py-3 rounded-xl bg-black/30 dark:bg-white/10 backdrop-blur-md border ${darkMode ? "border-gray-700" : "border-black/50"}`}>
            <FiMail className="text-xl text-black/80" />
            <input
              type="email"
              placeholder="you@example.com"
              className="ml-3 flex-1 bg-transparent text-black placeholder:text-black/60 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>
  
        <div>
          <label className="block mb-2 font-semibold text-sm">Password</label>
          <div className={`flex items-center px-4 py-3 rounded-xl bg-black/30 dark:bg-white/10 backdrop-blur-md border ${darkMode ? "border-gray-700" : "border-black/50"}`}>
            <FiLock className="text-xl text-black/80" />
            <input
              type="password"
              placeholder="********"
              className="ml-3 flex-1 bg-transparent text-black placeholder:text-white/60 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>
  
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 hover:from-green-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
        >
          Sign In
        </button>
  
        <p className="text-center text-sm text-black/80">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-green-500 hover:text-green-100 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
  
}
