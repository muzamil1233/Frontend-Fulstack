// Sidebar.jsx
import React, { useState } from "react";
import "./Sidebar.css";
import { FaHome, FaTshirt, FaUsers, FaCog, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: "Dashboard", icon: <FaHome /> ,path : "/home" },
    { name: "Clothes", icon: <FaTshirt />, path :"/category/men" },
    { name: "Users", icon: <FaUsers />,path: "/" },
    { name: "Settings", icon: <FaCog /> ,path: "/settings"},
  ];

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
     <div
  className="top-section"
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: isCollapsed ? "center" : "space-between",
    padding: "12px",
  }}
>
  <h2 className="logo">{!isCollapsed && "MyApp"}</h2>
  <FaBars
    className="toggle-btn"
    onClick={toggleSidebar}
    style={{
      cursor: "pointer",
      fontSize: "20px",
      color: "white",
    }}
  />
</div>


      <ul className="menu">
        {menuItems.map((item, index) => (
          <li key={index} 
          onClick={()=> navigate(item.path)}
          className="menu-item">
            <span className="icon">{item.icon}</span>
            {!isCollapsed && <span className="text">{item.name}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
