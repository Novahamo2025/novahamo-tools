import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="section" style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
      <div className="container" style={{ maxWidth: 520 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div style={{
            fontSize: 'clamp(4rem, 10vw, 7rem)',
            fontWeight: 900,
            lineHeight: 1,
            background: 'linear-gradient(135deg, #16A34A 0%, #4ADE80 50%, #22C55E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 'var(--space-3)',
            letterSpacing: '-0.04em',
          }}>
            404
          </div>

          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
            Page Not Found
          </h1>

          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', fontSize: '1rem', lineHeight: 1.6 }}>
            The tool or page you're looking for doesn't exist, has been moved, or the link might be broken.
          </p>

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary btn-lg">
              <Home size={18} /> Back to Home
            </Link>
            <Link to="/tools" className="btn btn-secondary btn-lg">
              <Compass size={18} /> Browse All Tools
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
