import './header.css';

function Header({ user, activeTab, setActiveTab, onLogout }) {
  return (
    <header className="header">
      <div className="header-logo">Parking Reviewer</div>
      <nav className="header-nav">
        {user && (
          <>
            <button
              type="button"
              className={`header-nav-link ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
            <button
              type="button"
              className={`header-nav-link ${activeTab === 'my-cars' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-cars')}
            >
              My Cars
            </button>
            <button className="header-logout" onClick={onLogout}>Logout</button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
