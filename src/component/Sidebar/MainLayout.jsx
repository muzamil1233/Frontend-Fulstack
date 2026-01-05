import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "../Header/Topbar"; // ✅ import Topbar
import "./MainLayout.css";

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="layout">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className="layout-main">
        <Topbar /> 
        <div className="layout-content">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
