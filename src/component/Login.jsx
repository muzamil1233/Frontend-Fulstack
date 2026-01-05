import React, { useState } from "react";
import "../component/Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user"); // Default role
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const endpoint =
      role === "admin"
        ? "http://localhost:8000/api/admin/signIn"
        : "http://localhost:8000/api/user/login";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("🧩 Login response:", data); // 👈 Check what backend sends

    if (res.ok) {
      // Always store the token
      if (data.token) localStorage.setItem("token", data.token);

      // Handle both possible user id formats
      if (data.user && (data.user.id || data.user._id)) {
        const id = data.user.id || data.user._id;
        localStorage.setItem("userId", id);
        console.log("✅ Stored userId:", id);
      } else {
        console.warn("⚠️ No user.id found in response");
      }

      // Redirect
      if (role === "admin") navigate("/admin");
      else navigate("/home");
    } else {
      setMessage(data.msg || "Login failed!");
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    setMessage("Error connecting to server");
  }
};


  return (
    <div className="outer">
 <div className="main">
      <h1>THE 🌍 WORLD</h1>
      <h3>Enter your login credentials</h3>

      <form id="loginForm" onSubmit={handleSubmit}>
         <div className="role">
          <label htmlFor="role">Login as:</label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
         </div>
     
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          autoComplete="username"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="wrap">
          <button  className = "submit" type="submit">Submit</button>
        </div>
      </form>

      <p>
        Not registered?{" "}
        <Link to="/signup" style={{ textDecoration: "none", color: "blue" }}>
          Create an account
        </Link>
      </p>

      {message && <p id="message">{message}</p>}
    </div>
    </div>
   
  );
};

export default Login;
