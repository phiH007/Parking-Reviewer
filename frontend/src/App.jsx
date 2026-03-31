import { useState } from 'react';
import Header from './components/header';
import Main from './components/main';
import Login from './components/login';
import MyCars from './components/MyCars';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  function handleLogin(theUser) {
    setUser(theUser);
  }

  function handleLogout() {
    setUser(null);
  }

  function handleSetActiveTab(tabName) {
    setActiveTab(tabName);
  }

  return (
    <div className="app-container">
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        onLogout={handleLogout}
      />

      <div className="content-layout">
        {user ? (
          <>
            {activeTab === 'home' ? <Main /> : <></>}
            {activeTab === 'my-cars' ? <MyCars /> : <></>}
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;
