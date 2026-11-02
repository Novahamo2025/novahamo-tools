import { Link } from 'react-router-dom';
import { Globe, ExternalLink, Sparkles, Heart } from 'lucide-react';
import categories from '../data/categories';

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const socialLinks = [
  { icon: InstagramIcon, label: 'Instagram', url: 'https://www.instagram.com/nova.hamo' },
  { icon: LinkedinIcon, label: 'LinkedIn', url: 'https://www.linkedin.com/company/142883301/admin/dashboard/' },
  { icon: YoutubeIcon, label: 'YouTube', url: 'https://www.youtube.com/@novahamotechoders' },
  { icon: FacebookIcon, label: 'Facebook', url: 'https://www.facebook.com/Godsarmyoffical' },
  { icon: Globe, label: 'Website', url: 'https://www.novahamotechnologies.com/' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-premium" style={{
      backgroundColor: 'var(--color-footer-bg)',
      color: 'var(--color-footer-text)',
      marginTop: 'auto',
      position: 'relative',
      borderTop: '1px solid rgba(22, 163, 74, 0.2)',
    }}>
      {/* Decorative top ambient glow line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #22C55E, transparent)',
        filter: 'blur(1px)',
      }} />

      <div className="container" style={{ padding: 'var(--space-12) var(--space-4) var(--space-8)' }}>
        <div className="footer-grid">
          {/* Brand Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }} aria-label="NovaHamo Tools">
              <div style={{
                width: 36,
                height: 36,
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
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
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-footer-heading)' }}>
                NovaHamo Tools
              </span>
            </Link>

            <p style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#22C55E',
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
            }}>
              Every Tool You Need. One Beautiful Workspace.
            </p>

            <p style={{
              fontSize: '0.85rem',
              lineHeight: 1.6,
              maxWidth: '320px',
              color: 'var(--color-footer-text)',
              opacity: 0.85,
            }}>
              Free, private, browser-based online tools for images, PDFs, QR codes, video, documents, coding, calculations, and daily productivity.
            </p>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.label}`}
                  title={social.label}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-footer-text)',
                    transition: 'all var(--transition-normal)',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                    e.currentTarget.style.color = '#22C55E';
                    e.currentTarget.style.borderColor = '#22C55E';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'var(--color-footer-text)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <social.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h3 style={{
              color: 'var(--color-footer-heading)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--space-4)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Sparkles size={14} style={{ color: '#22C55E' }} /> Categories
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
              {categories.map(cat => (
                <Link
                  key={cat.id}
                  to={cat.route}
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-footer-text)',
                    textDecoration: 'none',
                    padding: '3px 0',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#4ADE80'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-footer-text)'}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 style={{
              color: 'var(--color-footer-heading)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--space-4)',
            }}>
              Company & Legal
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {[
                { label: 'All Tools', path: '/tools' },
                { label: 'All Categories', path: '/categories' },
                { label: 'About NovaHamo Tools', path: '/about' },
                { label: 'Contact Us', path: '/contact' },
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-footer-text)',
                    textDecoration: 'none',
                    padding: '3px 0',
                    transition: 'color var(--transition-fast)',
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#4ADE80'}
                  onMouseOut={e => e.currentTarget.style.color = 'var(--color-footer-text)'}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.novahamotechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-footer-text)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 0',
                  marginTop: 'var(--space-1)',
                  fontWeight: 600,
                  transition: 'color var(--transition-fast)',
                }}
                onMouseOver={e => e.currentTarget.style.color = '#4ADE80'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--color-footer-text)'}
              >
                novahamotechnologies.com <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          marginTop: 'var(--space-10)',
          paddingTop: 'var(--space-6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-3)',
          fontSize: '0.8125rem',
        }}>
          <p style={{ color: 'var(--color-footer-text)', opacity: 0.8 }}>
            © {currentYear} NovaHamo Technologies Pvt. Ltd. All rights reserved.
          </p>
          <p style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-footer-text)', opacity: 0.7 }}>
            Designed with <Heart size={13} style={{ color: '#22C55E', fill: '#22C55E' }} /> for the world.
          </p>
        </div>
      </div>

      <style>{`
        @media screen and (min-width: 900px) {
          .footer-grid {
            grid-template-columns: 1.4fr 1.3fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
