import React from 'react'
import brand from "../../assets/Brand.jpg"
import "../HeroSection/HeroSection.css"

const HeroSection = () => {
  return (
    <>
     <section className="hero-section">
      <div className="hero-content">
        <h1>Discover Your Style</h1>
        <p>Shop the latest trends and timeless classics for every occasion.</p>
        <button className="cta-button">Shop Now</button>
      </div>
      <div className="hero-image">
        {/* <img src={brand} alt="Hero Banner" /> */}
      </div>
    </section>
    </>
    
  )
}

export default HeroSection
