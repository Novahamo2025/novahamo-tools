import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="section" style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--space-4)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)', maxWidth: '400px', margin: '0 auto var(--space-8)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={18} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
