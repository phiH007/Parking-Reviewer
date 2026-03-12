import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">MERN Template</div>
      <nav className="header-nav">
        <a href="#dashboard">Dashboard</a>
        <a href="#users">Users</a>
        <a href="#settings">Settings</a>
      </nav>
    </header>
  );
};

export default Header;