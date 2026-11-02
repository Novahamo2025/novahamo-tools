import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import tools, { searchTools } from '../data/tools';
import categories from '../data/categories';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function AllToolsPage() {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTools = useMemo(() => {
    let result = tools;
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    if (filter.trim()) {
      const searched = searchTools(filter);
      result = result.filter(t => searched.some(s => s.id === t.id));
    }
    return result;
  }, [filter, selectedCategory]);

  return (
    <div className="section">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'All Tools' },
        ]} />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-bg)', padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
            <Sparkles size={13} /> Comprehensive Catalog
          </div>
          <h1 className="section-title">All Tools Directory</h1>
          <p className="section-subtitle">
            Explore all {tools.length} browser-powered tools across {categories.length} categories.
          </p>
        </motion.div>

        {/* Controls: Search + Category Pills */}
        <div style={{ marginBottom: 'var(--space-8)' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '520px', marginBottom: 'var(--space-5)' }}>
            <Search size={17} style={{
              position: 'absolute', left: 'var(--space-4)',
              top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
              pointerEvents: 'none'
            }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by name, keyword or format... (e.g., PDF, compress, QR)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ paddingLeft: 'var(--space-10)', height: '48px', borderRadius: 'var(--radius-xl)' }}
              aria-label="Search all tools"
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            overflowX: 'auto',
            paddingBottom: 'var(--space-2)',
            scrollbarWidth: 'none',
          }}>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-primary' : 'btn-ghost'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: '0.8125rem',
                border: '1px solid var(--color-border)',
              }}
            >
              All ({tools.length})
            </button>
            {categories.map(cat => {
              const count = tools.filter(t => t.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: 'var(--space-2) var(--space-4)',
                    fontSize: '0.8125rem',
                    border: '1px solid var(--color-border)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            Showing {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
          </span>
          {(filter || selectedCategory !== 'all') && (
            <button
              onClick={() => { setFilter(''); setSelectedCategory('all'); }}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '0.75rem', padding: 'var(--space-1) var(--space-3)' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <motion.div
            className="grid grid-4"
            style={{ gap: 'var(--space-4)' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${selectedCategory}-${filter}`}
          >
            {filteredTools.map(tool => (
              <motion.div key={tool.id} variants={itemVariants}>
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: 'var(--space-16) var(--space-4)',
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--color-text)' }}>
              No tools matched your criteria
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
              Try searching with different terms or selecting another category.
            </p>
            <button
              onClick={() => { setFilter(''); setSelectedCategory('all'); }}
              className="btn btn-primary btn-sm"
            >
              Show All Tools
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
