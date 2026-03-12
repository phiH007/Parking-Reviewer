import React from 'react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-item active">
        <span>Home</span>
      </div>
      <div className="sidebar-item">
        <span>Cars</span>
      </div>
    </aside>
  );
};

export default Sidebar;