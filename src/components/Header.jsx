import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon, Search } from 'lucide-react';
import { searchTools } from '../data/tools';

export default function Header({ theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

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
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--color-header-bg)',
      borderBottom: '1px solid var(--color-header-border)',
      backdropFilter: 'blur(8px)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 'var(--header-height)',
        gap: 'var(--space-4)',
      }}>
        {/* Logo */}
        <Link to="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          fontWeight: 800,
          fontSize: '1.125rem',
          color: 'var(--color-primary)',
          textDecoration: 'none',
          flexShrink: 0,
        }} aria-label="NovaHamo Tools - Home">
          <div style={{
            width: 34,
            height: 34,
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            flexShrink: 0,
          }}>
            <img
              src="/logo.png"
              alt="NovaHamo Tools Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <span style={{ display: 'inline' }}>NovaHamo Tools</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
        }} className="desktop-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: location.pathname === item.path ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {/* Search */}
          <div ref={searchRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn btn-ghost btn-sm"
              aria-label="Search tools"
              style={{ padding: 'var(--space-2)' }}
            >
              <Search size={20} />
            </button>
            {searchOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: 'var(--space-2)',
                width: '320px',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                padding: 'var(--space-3)',
                zIndex: 200,
              }}>
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
            className="btn btn-ghost btn-sm"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ padding: 'var(--space-2)' }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="btn btn-ghost btn-sm mobile-menu-btn"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            style={{ padding: 'var(--space-2)' }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav style={{
          backgroundColor: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          padding: 'var(--space-4)',
        }} className="mobile-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'block',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                fontSize: '1rem',
                fontWeight: 500,
                color: location.pathname === item.path ? 'var(--color-primary)' : 'var(--color-text)',
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      <style>{`
        .desktop-nav { display: none; }
        .mobile-menu-btn { display: flex; }
        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
          .mobile-menu-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
      `}</style>
    </header>
  );
}
