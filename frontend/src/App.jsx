import { useState } from 'react';
import Header from './components/header';
import Main from './components/main';
import Login from './components/login';
import MyCars from './components/MyCars';
import AdminPanel from './components/AdminPanel';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');

  function handleLogin(theUser) {
    setUser(theUser);
    setActiveTab('home');
  }

  function handleLogout() {
    setUser(null);
    setActiveTab('home');
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
            {activeTab === 'admin' && user.role === 'admin' ? <AdminPanel user={user} /> : <></>}
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;
