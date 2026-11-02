import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { searchTools } from '../data/tools';
import ToolIcon from './ToolIcon';

export default function Header({ theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [scrolled, setScrolled] = useState(false);
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
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
              title="Search tools"
            >
              <Search size={19} />
            </button>
            {searchOpen && (
              <div className="header-search-dropdown">
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none'
                  }} />
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Search tools... (e.g. PDF, QR, Image)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    aria-label="Search tools"
                    style={{ paddingLeft: '36px' }}
                  />
                </div>

                {searchResults.length > 0 && (
                  <div style={{ marginTop: 'var(--space-2)', maxHeight: '320px', overflowY: 'auto' }}>
                    {searchResults.map(tool => (
                      <Link
                        key={tool.id}
                        to={tool.route}
                        className="search-result-item"
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <ToolIcon toolId={tool.id} category={tool.category} size="sm" showBadge={false} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="search-result-name">{tool.name}</div>
                          <div className="search-result-desc">
                            {tool.description.substring(0, 68)}...
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                  <p className="search-empty-state">
                    No tools found for &quot;{searchQuery}&quot;
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-icon"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>

          {/* Mobile Menu Button - Strictly rendered only on mobile */}
          {!isDesktop && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-menu-btn"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mobile-nav-categories">
            <div className="mobile-nav-cat-title">Popular Categories</div>
            <div className="mobile-nav-cat-grid">
              <Link to="/tools/pdf" className="mobile-cat-pill" onClick={() => setMobileOpen(false)}>📄 PDF</Link>
              <Link to="/tools/images" className="mobile-cat-pill" onClick={() => setMobileOpen(false)}>🖼️ Images</Link>
              <Link to="/tools/qr" className="mobile-cat-pill" onClick={() => setMobileOpen(false)}>📱 QR Codes</Link>
              <Link to="/tools/video-audio" className="mobile-cat-pill" onClick={() => setMobileOpen(false)}>🎬 Video & Audio</Link>
              <Link to="/tools/calculators" className="mobile-cat-pill" onClick={() => setMobileOpen(false)}>🧮 Calculators</Link>
              <Link to="/tools/developer" className="mobile-cat-pill" onClick={() => setMobileOpen(false)}>💻 Developer</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
