// src/App.jsx
import React from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Main from './components/main';
import Login from './components/login'
import './App.css';

// need to figure out routing and connect login page to mongodb. Opens by default to login page
function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="content-layout">
        <Login />
        {/* <Sidebar />
        <Main /> */}
      </div>
    </div>
  );
}

export default App;