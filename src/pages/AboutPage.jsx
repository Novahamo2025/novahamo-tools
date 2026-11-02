import { Globe, Users, Wrench, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/Breadcrumbs';

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '860px' }}>
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'About' },
        ]} />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Sparkles size={13} /> The Mission
          </div>
          <h1 className="section-title">About NovaHamo Tools</h1>
          <p className="section-subtitle">
            Every Tool You Need. One Beautiful Workspace.
          </p>
        </motion.div>

        <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
          {/* Mission Card */}
          <div className="card" style={{
            padding: 'var(--space-8)',
            marginBottom: 'var(--space-8)',
            background: 'linear-gradient(135deg, var(--color-card) 0%, var(--color-primary-bg) 100%)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
          }}>
            <p style={{ fontSize: '1.0625rem', color: 'var(--color-text)', lineHeight: 1.7, marginBottom: 0 }}>
              <strong style={{ color: 'var(--color-primary)' }}>NovaHamo Tools</strong> is an all-in-one suite of free,
              modern online utilities engineered by <strong style={{ color: 'var(--color-text)' }}>NovaHamo Technologies Pvt. Ltd.</strong>{' '}
              Our goal is to eliminate bloated software, intrusive popups, and paid paywalls by providing
              lightning-fast, private, browser-native tools that everyone can rely on every single day.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="grid grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
            {[
              {
                icon: Shield,
                title: '100% Privacy by Default',
                desc: 'Our tools process your files directly in your web browser. Your confidential PDFs, photos, and personal data never leave your device.',
                color: '#16A34A',
              },
              {
                icon: Wrench,
                title: 'Free & Unrestricted',
                desc: 'No account registration, no credit cards, no subscriptions, and zero watermarks. Just open the tool and get your task finished.',
                color: '#22C55E',
              },
              {
                icon: Users,
                title: 'Built for Everyone',
                desc: 'Clean, intuitive, and distraction-free design accessible to students, creators, engineers, accountants, and busy professionals.',
                color: '#3B82F6',
              },
              {
                icon: Globe,
                title: 'Zero Install Required',
                desc: 'Fully responsive web application running smoothly on desktops, laptops, tablets, and mobile phones with offline-friendly resilience.',
                color: '#8B5CF6',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="card"
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: `${item.color}15`,
                  color: item.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${item.color}20`,
                }}>
                  <item.icon size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 'var(--space-1)', color: 'var(--color-text)' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Company Details */}
          <div className="card" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 'var(--space-2)' }}>
              NovaHamo Technologies Pvt. Ltd.
            </h2>
            <p style={{ marginBottom: 'var(--space-4)', fontSize: '0.9375rem' }}>
              NovaHamo Technologies Pvt. Ltd. is dedicated to building modern digital solutions that empower people and simplify workflows.
            </p>
            <a
              href="https://www.novahamotechnologies.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: 'inline-flex' }}
            >
              Visit Corporate Website →
            </a>
          </div>

          {/* How It Works */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: 'var(--space-3)' }}>
              How Browser-Based Processing Works
            </h2>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7 }}>
              NovaHamo Tools harnesses cutting-edge Web Standards (HTML5 Canvas, WebAssembly, Web Audio API, and Client-Side Cryptography)
              to execute heavy computational tasks straight inside your browser engine. This means zero server latency, instant results,
              and absolute data privacy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
