import React from "react";
import "../subMainSection/subMain.css";
import backgroundImage from "../../assets/backgrounding.jpg"


const SubMain = () => {
  return (
    <div className="wear-section">
      <div className="wear-content">
        <h2>Wear to Wedding</h2>
        <p>Discover elegant styles for your perfect day.</p>
        <button>Shop Now</button>
      </div>
      <div className="wear-image">
        <img
        src={backgroundImage}
          alt="Wear to Wedding"
        />
      </div>
    </div>
  );
};

export default SubMain;
