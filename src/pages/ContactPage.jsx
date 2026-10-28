import { Mail, Globe, MapPin } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Contact' },
        ]} />

        <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>Contact Us</h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
          Have questions, feedback, or suggestions? We'd love to hear from you.
        </p>

        <div className="grid grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <div className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <Globe size={24} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>Website</h3>
              <a href="https://www.novahamotechnologies.com/" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--color-primary)', fontSize: '0.9375rem' }}>
                www.novahamotechnologies.com
              </a>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
            <Mail size={24} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: 2 }} />
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-1)' }}>Email</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
                Visit our website for contact details.
              </p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>Follow Us</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { label: 'Instagram', url: 'https://www.instagram.com/nova.hamo' },
              { label: 'LinkedIn', url: 'https://www.linkedin.com/company/142883301/admin/dashboard/' },
              { label: 'YouTube', url: 'https://www.youtube.com/@novahamotechoders' },
              { label: 'Facebook', url: 'https://www.facebook.com/Godsarmyoffical' },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{
                  color: 'var(--color-primary)',
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                }}>
                {s.label} →
              </a>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
          NovaHamo Technologies Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}
