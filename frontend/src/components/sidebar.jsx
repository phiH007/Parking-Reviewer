import React from 'react';
import './sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-item active">
        <span>Home</span>
      </div>
      <div className="sidebar-item">
        <span>My Cars</span>
      </div>
    </aside>
  );
};

export default Sidebar;