import './header.css';

function Header(props) {
  const user = props.user;
  const activeTab = props.activeTab;
  const setActiveTab = props.setActiveTab;
  const onLogout = props.onLogout;

  function goHome() {
    setActiveTab('home');
  }

  function goToMyCars() {
    setActiveTab('my-cars');
  }

  function goToAdmin() {
    setActiveTab('admin');
  }

  function handleLogoutClick() {
    onLogout();
  }

  return (
    <header className="header">
      <div className="header-logo">Parking Reviewer Project</div>

      {user ? (
        <nav className="header-nav">
          <span className="header-user-role">
            {user.username} ({user.role})
          </span>

          <button
            type="button"
            className={`header-nav-link ${activeTab === 'home' ? 'active' : ''}`}
            onClick={goHome}
          >
            Home
          </button>

          <button
            type="button"
            className={`header-nav-link ${activeTab === 'my-cars' ? 'active' : ''}`}
            onClick={goToMyCars}
          >
            My Cars
          </button>

          {user.role === 'admin' ? (
            <button
              type="button"
              className={`header-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={goToAdmin}
            >
              Admin
            </button>
          ) : <></>}

          <button
            type="button"
            className="header-logout"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </nav>
      ) : <></>}
    </header>
  );
}

export default Header;
