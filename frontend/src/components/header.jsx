import './header.css';

function Header({ user, onLogout }) {
  
  return (
    <header className="header">
      <div className="header-logo">Parking Reviewer</div>
      <nav className="header-nav">
        {user && (
            <>
            <a href="#home" className="header-nav-link active">Home</a>
            <a href="#my-cars" className="header-nav-link">My Cars</a>
            <button className="header-logout" onClick={onLogout}>Logout</button>
            </>
        )}
      </nav>
    </header>
  );
}

export default Header;