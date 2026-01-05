import React, { useState } from "react";
import "../Footer/Footer.css";
import logo from "../../assets/Logo.jpeg";
import { Link } from "react-router-dom";

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:8000/api/query/sendquery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("Message sent!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send!");
      }
    } catch (error) {
      setStatus("Error sending message!");
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo & Description */}
        <div className="footer-logo">
          <img src={logo} alt="Tulos Logo" />
          <p>Your one-stop fashion destination for all occasions.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/home">New Arrivals</Link></li>
            <li><Link to="/wedding">Wear to Wedding</Link></li>
            <li><Link to="/category/men">Man</Link></li>
            <li><Link to="/category/women">Woman</Link></li>
            <li><Link to="/category/kids">Kids</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact">
          <h3>Contact Info</h3>
          <p>Email: muzamiln213@gmail.com</p>
          <p>Phone: +91 6006318647</p>
          <p>Address: Sangrama Sopore, Jammu & Kashmir, India</p>
        </div>

        {/* Query Box */}
        <div className="footer-query-box">
          <h3>Ask a Query</h3>

          <form onSubmit={handleSubmit} className="query-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">Send</button>
          </form>

          <p className="query-status">{status}</p>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2025 The world. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
