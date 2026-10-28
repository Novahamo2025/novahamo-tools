import { Link } from 'react-router-dom';
import { getToolCount } from '../data/tools';

export default function CategoryCard({ category }) {
  const Icon = category.icon;
  const toolCount = getToolCount(category.id);

  return (
    <Link to={category.route} className="card card-clickable" style={{
      textDecoration: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
    }}>
      <div style={{
        width: 48, height: 48,
        borderRadius: 'var(--radius-lg)',
        backgroundColor: `${category.color}15`,
        color: category.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={24} />
      </div>
      <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text)' }}>
        {category.name}
      </h3>
      <p style={{
        fontSize: '0.8125rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.5,
        flex: 1,
      }}>
        {category.description}
      </p>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--color-border)',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--color-primary)',
          backgroundColor: 'var(--color-primary-bg)',
          padding: 'var(--space-1) var(--space-3)',
          borderRadius: 'var(--radius-full)',
        }}>
          {toolCount} tools
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          Explore →
        </span>
      </div>
    </Link>
  );
}
