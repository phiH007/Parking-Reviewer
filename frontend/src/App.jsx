// src/App.jsx
import React, { useState } from 'react';
import Header from './components/header';
import Main from './components/main';
import Login from './components/login';
import MyCars from './components/MyCars';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="app-container">
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => setUser(null)}
      />
      <div className="content-layout">
        {user ? (
          <>
            {activeTab === 'home' && <Main />}
            {activeTab === 'my-cars' && <MyCars />}
          </>
        ) : (
          <Login onLogin={setUser} />
        )}
      </div>
    </div>
  );
}

export default App;
