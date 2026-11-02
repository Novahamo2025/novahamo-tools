import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs-nav">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {index > 0 && (
            <ChevronRight size={12} className="breadcrumb-sep" />
          )}
          {item.path ? (
            <Link to={item.path} className="breadcrumb-link">
              {item.label}
            </Link>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
        </span>
      ))}
      <style>{`
        .breadcrumbs-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-bottom: var(--space-3);
          flex-wrap: wrap;
        }
        .breadcrumb-item {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .breadcrumb-sep {
          color: var(--color-text-muted);
          opacity: 0.5;
          flex-shrink: 0;
        }
        .breadcrumb-link {
          color: var(--color-text-muted);
          text-decoration: none;
          font-weight: 500;
          padding: 2px 4px;
          border-radius: 4px;
          transition: color var(--transition-fast), background-color var(--transition-fast);
        }
        .breadcrumb-link:hover {
          color: var(--color-primary);
          background-color: var(--color-primary-bg);
        }
        .breadcrumb-current {
          color: var(--color-primary);
          font-weight: 600;
          padding: 2px 4px;
        }
      `}</style>
    </nav>
  );
}
