import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import tools, { searchTools } from '../data/tools';
import categories from '../data/categories';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';

export default function AllToolsPage() {
  const [filter, setFilter] = useState('');

  const filteredTools = useMemo(() => {
    if (!filter.trim()) return tools;
    return searchTools(filter);
  }, [filter]);

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'All Tools' },
        ]} />

        <h1 className="section-title">All Tools</h1>
        <p className="section-subtitle" style={{ marginBottom: 'var(--space-6)' }}>
          Browse all {tools.length} tools across {categories.length} categories.
        </p>

        <div style={{ position: 'relative', maxWidth: '480px', marginBottom: 'var(--space-8)' }}>
          <Search size={16} style={{
            position: 'absolute', left: 'var(--space-3)',
            top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search tools..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ paddingLeft: 'var(--space-8)' }}
            aria-label="Search all tools"
          />
        </div>

        {filter.trim() ? (
          <>
            <p style={{
              fontSize: '0.875rem', fontWeight: 600,
              color: 'var(--color-text-secondary)',
              marginBottom: 'var(--space-4)',
            }}>
              {filteredTools.length} result{filteredTools.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-3">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </>
        ) : (
          categories.map(cat => {
            const catTools = tools.filter(t => t.category === cat.id);
            return (
              <div key={cat.id} style={{ marginBottom: 'var(--space-10)' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: 'var(--space-4)',
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <cat.icon size={20} style={{ color: cat.color }} />
                    {cat.name}
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 600,
                      color: 'var(--color-primary)',
                      backgroundColor: 'var(--color-primary-bg)',
                      padding: '2px 10px', borderRadius: 'var(--radius-full)',
                    }}>{catTools.length}</span>
                  </h2>
                  <Link to={cat.route} style={{
                    fontSize: '0.8125rem', fontWeight: 600,
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                  }}>View All →</Link>
                </div>
                <div className="grid grid-3">
                  {catTools.map(tool => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
