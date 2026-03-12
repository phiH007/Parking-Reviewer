import React from 'react';

const MainContent = () => {
  return (
    <main className="main-content">
      <h2>Welcome to Your MERN Dashboard</h2>
      
      <div className="card-container">
        <div className="main-card">
          <h3>Car 1</h3>
          {/* fix me get image worky pls*/}
          <img src={"Parking Reviewer/frontend/src/assets/2025-nissan-altima.jpg"}/>
          <p>Nissan Altima</p>
        </div>
        
        <div className="main-card">
          <h3>Active Projects</h3>
          <p>Project data requested via your Express API.</p>
        </div>
        
        <div className="main-card">
          <h3>Server Status</h3>
          <p>Check Node.js server responsiveness.</p>
        </div>
      </div>
    </main>
  );
};

export default MainContent;