import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function ToolCard({ tool }) {
  return (
    <Link to={tool.route} className="card card-clickable" style={{
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      padding: 'var(--space-5)',
    }}>
      <h3 style={{
        fontSize: '0.9375rem',
        fontWeight: 700,
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}>
        {tool.name}
      </h3>
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.5,
        flex: 1,
      }}>
        {tool.description}
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-1)',
        color: 'var(--color-primary)',
        fontSize: '0.8125rem',
        fontWeight: 600,
        marginTop: 'var(--space-2)',
      }}>
        Open Tool <ArrowRight size={14} />
      </div>
    </Link>
  );
}
