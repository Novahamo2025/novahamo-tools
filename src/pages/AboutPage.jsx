import { Globe, Users, Wrench, Shield } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'About' },
        ]} />

        <h1 className="section-title" style={{ marginBottom: 'var(--space-6)' }}>About NovaHamo Tools</h1>

        <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          <p style={{ fontSize: '1.0625rem', marginBottom: 'var(--space-6)' }}>
            <strong style={{ color: 'var(--color-text)' }}>NovaHamo Tools</strong> is a free collection of online
            utilities built by <strong style={{ color: 'var(--color-text)' }}>NovaHamo Technologies Pvt. Ltd.</strong>{' '}
            Our mission is to provide simple, fast, and privacy-respecting tools that anyone can use — students,
            developers, job seekers, professionals, and content creators.
          </p>

          <div className="grid grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            {[
              { icon: Shield, title: 'Privacy First', desc: 'Most tools process your files entirely in your browser. We don\'t upload or store your data.' },
              { icon: Wrench, title: 'Free Forever', desc: 'All tools are completely free. No registration, no login, no hidden fees.' },
              { icon: Users, title: 'For Everyone', desc: 'Designed to be beginner-friendly and accessible to users of all skill levels.' },
              { icon: Globe, title: 'Works Everywhere', desc: 'Responsive design that works on desktops, tablets, and mobile devices.' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-bg)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-1)', color: 'var(--color-text)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
            Our Company
          </h2>
          <p style={{ marginBottom: 'var(--space-4)' }}>
            NovaHamo Technologies Pvt. Ltd. is a technology company focused on building useful digital products.
            Visit our official website at{' '}
            <a href="https://www.novahamotechnologies.com/" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>
              novahamotechnologies.com
            </a>.
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
            How It Works
          </h2>
          <p>
            NovaHamo Tools runs entirely in your web browser. When you upload a file or enter data, it is processed
            locally on your device using JavaScript and browser APIs. Your files are never sent to our servers unless
            a specific tool explicitly requires an external service, which is always clearly indicated.
          </p>
        </div>
      </div>
    </div>
  );
}
