import React from 'react';

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-logo">Parking Reviewer</div>
      <nav className="header-nav">
        {user && (
          <button onClick={onLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;