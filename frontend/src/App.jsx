// src/App.jsx
import React, { useState } from 'react';
import Header from './components/header';
import Main from './components/main';
import Login from './components/login';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Header user={user} onLogout={() => setUser(null)} />
      <div className="app-container">
        <div className="content-layout">
          {user ? (
            <Main />
          ) : (
            <Login onLogin={setUser} />
          )}
        </div>
      </div>
    </>
  );
}

export default App;