import React from 'react';
import Topbar from '../Header/Topbar';
import HeroSection from '../HeroSection/HeroSection';
import Main from '../MainSection/Main';
import SubMain from '../subMainSection/subMain';
import Section from '../section/Section';
import Footer from '../Footer/Footer';

const Dashboard = () => {
  return (
    <div style={{ paddingTop: "60px" }}> {/* correct camelCase */}
      <Topbar />
      <HeroSection />
      <Main />
      <SubMain />
      <Section/>
      <Footer />
      
     
    </div>
  );
};

export default Dashboard;
