import React from 'react';
import './main.css';
import nissanAltima from '../assets/2025-nissan-altima.jpg';

const Main = () => {
  return (
    <main className="main-content">
      <h2>Welcome to Your Car Dashboard</h2>

      <div className="card-container">
        <div className="main-card">
          <h3>IPLE9KS</h3>
          <img src={nissanAltima} alt="Nissan Altima" />
          <p>Nissan Altima</p>
        </div>
        
        <div className="main-card">
          <h3>XF13LM</h3>
          <p>Tesla Model3</p>
        </div>
        
        <div className="main-card">
          <h3>ABS213S</h3>
          <p>Hyundai Sante Fe</p>
        </div>
      </div>
    </main>
  );
};

export default Main;