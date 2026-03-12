// src/App.jsx
import React from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import MainContent from './components/main';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-layout">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default App;