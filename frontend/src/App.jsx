// src/App.jsx
import React, { useState } from 'react';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Main from './components/main';
import Login from './components/login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app-container">
      <Header user={user} onLogout={() => setUser(null)} />
      <div className="content-layout">
        {user ? (
          <>
            <Sidebar />
            <Main />
          </>
        ) : (
          <Login onLogin={setUser} />
        )}
      </div>
    </div>
  );
}

export default App;