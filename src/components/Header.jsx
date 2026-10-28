import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { searchTools } from '../data/tools';

export default function Header({ theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return false;
  });
  const searchRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 768;
      setIsDesktop(desktop);
      if (desktop) {
        setMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setSearchResults(searchTools(searchQuery).slice(0, 8));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Tools', path: '/tools' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="brand-logo" aria-label="NovaHamo Tools - Home">
          <div className="brand-logo-badge">
            <img
              src="/logo.png"
              alt="NovaHamo Tools Logo"
              className="brand-logo-img"
            />
          </div>
          <span className="brand-logo-text">NovaHamo Tools</span>
        </Link>

        {/* Desktop Navigation - Strictly rendered only on desktop */}
        {isDesktop && (
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right Actions */}
        <div className="header-actions">
          {/* Search */}
          <div ref={searchRef} className="search-wrapper">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn btn-ghost btn-icon"
              aria-label="Search tools"
            >
              <Search size={20} />
            </button>
            {searchOpen && (
              <div className="header-search-dropdown">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  aria-label="Search tools"
                />
                {searchResults.length > 0 && (
                  <div style={{ marginTop: 'var(--space-2)', maxHeight: '300px', overflowY: 'auto' }}>
                    {searchResults.map(tool => (
                      <Link
                        key={tool.id}
                        to={tool.route}
                        style={{
                          display: 'block',
                          padding: 'var(--space-2) var(--space-3)',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.875rem',
                          color: 'var(--color-text)',
                          textDecoration: 'none',
                          transition: 'background-color var(--transition-fast)',
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-bg)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontWeight: 600 }}>{tool.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          {tool.description.substring(0, 60)}...
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <p style={{
                    padding: 'var(--space-4)',
                    textAlign: 'center',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                  }}>No tools found</p>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Mobile Menu Button - Strictly rendered only on mobile */}
          {!isDesktop && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {!isDesktop && mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile Navigation">
          <div className="mobile-nav-links">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mobile-nav-categories">
            <div className="mobile-nav-cat-title">Popular Categories</div>
            <div className="mobile-nav-cat-grid">
              <Link to="/tools/pdf" className="mobile-cat-pill">📄 PDF</Link>
              <Link to="/tools/images" className="mobile-cat-pill">🖼️ Images</Link>
              <Link to="/tools/qr" className="mobile-cat-pill">📱 QR Codes</Link>
              <Link to="/tools/video-audio" className="mobile-cat-pill">🎬 Video & Audio</Link>
              <Link to="/tools/calculators" className="mobile-cat-pill">🧮 Calculators</Link>
              <Link to="/tools/developer" className="mobile-cat-pill">💻 Developer</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
