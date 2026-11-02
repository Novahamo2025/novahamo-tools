import { Mail, Globe, Sparkles, ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '860px' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Contact' },
        ]} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Sparkles size={13} /> We Are Here To Help
          </div>
          <h1 className="section-title">Contact NovaHamo Technologies</h1>
          <p className="section-subtitle">
            Have a tool request, feedback, or need commercial support? Connect with our engineering and product teams.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <motion.div
            className="card"
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(22, 163, 74, 0.12)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Globe size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 'var(--space-1)' }}>Corporate Headquarters</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>
                NovaHamo Technologies Pvt. Ltd.
              </p>
              <a
                href="https://www.novahamotechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-primary)', fontSize: '0.9375rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                www.novahamotechnologies.com <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="card"
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}
          >
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: '#3B82F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Mail size={24} />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: 'var(--space-1)' }}>Digital Support</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--space-2)' }}>
                Questions or issues? Reach out through our official website portal.
              </p>
              <a
                href="https://www.novahamotechnologies.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3B82F6', fontSize: '0.9375rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Visit Support Portal <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Social Network Hub */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MessageSquare size={18} style={{ color: 'var(--color-primary)' }} /> Follow & Connect
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
            Stay updated with new tool releases, platform features, and company announcements:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
            {[
              { label: 'Instagram', handle: '@nova.hamo', url: 'https://www.instagram.com/nova.hamo' },
              { label: 'LinkedIn', handle: 'NovaHamo Technologies', url: 'https://www.linkedin.com/company/142883301/admin/dashboard/' },
              { label: 'YouTube', handle: '@novahamotechoders', url: 'https://www.youtube.com/@novahamotechoders' },
              { label: 'Facebook', handle: 'NovaHamo Official', url: 'https://www.facebook.com/Godsarmyoffical' },
            ].map(s => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                  textDecoration: 'none',
                  color: 'var(--color-text)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all var(--transition-fast)',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = 'var(--color-primary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-bg)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                }}
              >
                <span>{s.label}</span>
                <span style={{ color: 'var(--color-primary)', fontSize: '0.8125rem' }}>↗</span>
              </a>
            ))}
          </div>
        </div>

        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8125rem', textAlign: 'center' }}>
          NovaHamo Technologies Pvt. Ltd. • Delivering Free Online Tools for Everyone
        </p>
      </div>
    </div>
  );
}
