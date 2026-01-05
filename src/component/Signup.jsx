import React, { useState } from "react";
import "../component/Signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("user"); // default role
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Select endpoint based on chosen role
      const endpoint =
        role === "admin"
          ? "http://localhost:8000/api/admin/signup"
          : "http://localhost:8000/api/user/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Signup successful! Redirecting...");
        // redirect to login
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setMessage(data.msg || "Signup failed!");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div className="outer">
       <div className="container">
      <h2>Signup Form</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-role">
          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <div className="password-hint">
            Password must be at least 8 characters long and include at least
            one uppercase, one lowercase, one number, and one special character.
          </div>
        </div>

        <button className="signup" type="submit">Signup</button>
      </form>

      <p id="message">{message}</p>
    </div>
    </div>
   
  );
};

export default Signup;
