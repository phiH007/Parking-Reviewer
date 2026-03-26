import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-logo">Parking Reviewer</div>
      <nav className="header-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#users">User</a>
        <a href="#settings">Settings</a>
        {user && (
          <button onClick={onLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;