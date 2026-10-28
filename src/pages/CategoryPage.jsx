import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import categories, { getCategoryBySlug } from '../data/categories';
import { getToolsByCategory } from '../data/tools';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';

export default function CategoryPage() {
  const { slug } = useParams();
  const [filter, setFilter] = useState('');

  const category = getCategoryBySlug(slug);
  const categoryTools = useMemo(() => {
    return category ? getToolsByCategory(category.id) : [];
  }, [category]);

  const filteredTools = useMemo(() => {
    if (!filter.trim()) return categoryTools;
    const q = filter.toLowerCase();
    return categoryTools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.keywords && t.keywords.some(k => k.includes(q)))
    );
  }, [categoryTools, filter]);

  // If no slug, show all categories
  if (!slug) {
    return (
      <div className="section">
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Home', path: '/' },
            { label: 'Categories' },
          ]} />
          <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>All Categories</h1>
          <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
            Browse {categories.length} tool categories.
          </p>
          <div className="grid grid-4">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Category Not Found</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            The category you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'Categories', path: '/categories' },
          { label: category.name },
        ]} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-2)',
        }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 'var(--radius-lg)',
            backgroundColor: `${category.color}15`,
            color: category.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{category.name}</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              {category.description}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-4)',
          marginTop: 'var(--space-6)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
          }}>
            {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} available
          </span>

          <div style={{ position: 'relative', minWidth: '240px', flex: '0 1 320px' }}>
            <Search size={16} style={{
              position: 'absolute', left: 'var(--space-3)',
              top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }} />
            <input
              type="text"
              className="input-field"
              placeholder="Filter tools..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ paddingLeft: 'var(--space-8)' }}
              aria-label="Filter tools in this category"
            />
          </div>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-3">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-12)',
            color: 'var(--color-text-muted)',
          }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              No tools match your filter
            </p>
            <p style={{ fontSize: '0.875rem' }}>Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
