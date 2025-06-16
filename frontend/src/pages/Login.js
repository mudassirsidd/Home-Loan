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
      className={`min-h-screen flex items-center justify-center px-4
        ${
          darkMode
            ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-700"
            : "bg-gradient-to-tr from-green-400 to-blue-500"
        } transition-colors duration-500`}
    >
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center space-x-2 bg-white dark:bg-gray-800 dark:text-gray-100 px-4 py-2 rounded-md shadow-md hover:brightness-110 transition"
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      <form
        onSubmit={handleLogin}
        className={`max-w-md w-full p-8 rounded-lg shadow-lg
          ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}
          space-y-6 transition-colors duration-500`}
      >
        <h2 className="text-3xl font-bold text-center">Login to your account</h2>

        <div>
          <label className="block mb-2 font-medium">Email</label>
          <div
            className={`flex items-center rounded-md px-3 py-2 border
            ${
              darkMode
                ? "border-gray-600 bg-gray-700"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <FiMail className={darkMode ? "text-gray-300" : "text-gray-600"} />
            <input
              type="email"
              placeholder="you@example.com"
              className={`ml-2 flex-1 bg-transparent outline-none placeholder:${
                darkMode ? "gray-400" : "gray-500"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium">Password</label>
          <div
            className={`flex items-center rounded-md px-3 py-2 border
            ${
              darkMode
                ? "border-gray-600 bg-gray-700"
                : "border-gray-300 bg-gray-100"
            }`}
          >
            <FiLock className={darkMode ? "text-gray-300" : "text-gray-600"} />
            <input
              type="password"
              placeholder="********"
              className={`ml-2 flex-1 bg-transparent outline-none placeholder:${
                darkMode ? "gray-400" : "gray-500"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded-md font-semibold transition duration-300
            ${
              darkMode
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
        >
          Sign In
        </button>

        <p
          className={`text-center ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-green-400 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
