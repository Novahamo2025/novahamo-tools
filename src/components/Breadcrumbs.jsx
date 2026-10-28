import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-1)',
      fontSize: '0.8125rem',
      color: 'var(--color-text-secondary)',
      marginBottom: 'var(--space-4)',
      flexWrap: 'wrap',
    }}>
      {items.map((item, index) => (
        <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          {index > 0 && <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />}
          {item.path ? (
            <Link
              to={item.path}
              style={{
                color: 'var(--color-text-secondary)',
                textDecoration: 'none',
                transition: 'color var(--transition-fast)',
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
