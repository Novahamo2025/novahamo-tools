import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, PackageSearch, ShieldCheck, Sparkles, X } from 'lucide-react';
import categories, { getCategoryBySlug } from '../data/categories';
import { getToolsByCategory } from '../data/tools';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';
import CategoryVisual3D from '../components/CategoryVisual3D';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

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

  // If no slug, show all categories in 3D grid
  if (!slug) {
    return (
      <div className="section">
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Home', path: '/' },
            { label: 'Categories' },
          ]} />
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-bg)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-3)'
            }}>
              <Sparkles size={13} /> Full Category Index
            </div>
            <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
              All Tool Categories
            </h1>
            <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
              Browse all {categories.length} specialized domains with 160+ zero-install browser tools.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map(cat => (
              <motion.div key={cat.id} variants={itemVariants}>
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-4)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="section-title">Category Not Found</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 440, margin: '0 auto var(--space-6)' }}>
              The category you are looking for does not exist or has been relocated.
            </p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const Icon = category.icon;

  return (
    <div>
      {/* Hero Section with Bespoke 3D Environment */}
      <div className="category-page-hero" style={{ '--cat-color': category.color }}>
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Home', path: '/' },
            { label: 'Categories', path: '/categories' },
            { label: category.name },
          ]} />

          <div className="category-hero-grid">
            {/* Left Column: Heading, Meta, Stats */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: category.color,
                background: `color-mix(in srgb, ${category.color} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${category.color} 28%, transparent)`,
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--space-3)',
              }}>
                <Icon size={14} /> Category Engine
              </div>

              <h1 style={{
                fontSize: 'clamp(1.75rem, 4.5vw, 2.75rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                marginBottom: 'var(--space-3)',
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
              }}>
                {category.name}
              </h1>

              <p style={{
                color: 'var(--color-text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                maxWidth: 580,
                marginBottom: 'var(--space-5)',
              }}>
                {category.description}
              </p>

              {/* Trust & Spec Ribbon */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <span className="category-page-count" style={{ margin: 0, fontSize: '0.8125rem', padding: '0.35rem 0.85rem' }}>
                  <Sparkles size={13} /> {categoryTools.length} Tools Available
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-primary-light)',
                  background: 'rgba(34, 197, 94, 0.08)',
                  border: '1px solid rgba(109, 255, 154, 0.2)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                }}>
                  <ShieldCheck size={13} /> 100% Client-Side Privacy
                </span>
              </div>
            </motion.div>

            {/* Right Column: 3D Kinetic Category Environment */}
            <motion.div
              className="category-hero-visual-col"
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <div className="category-hero-visual-card">
                <CategoryVisual3D categoryId={category.id} color={category.color} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filter Bar + Grid */}
      <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="container">
          <div className="category-page-filter" style={{ marginBottom: 'var(--space-8)' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                {category.name} Catalog
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                Showing {filteredTools.length} of {categoryTools.length} tools
                {filter.trim() ? ` matching "${filter}"` : ''}
              </span>
            </div>

            <div className="filter-search-wrap" style={{ minWidth: 260, maxWidth: 360, width: '100%' }}>
              <Search size={16} />
              <input
                type="text"
                className="input-field"
                placeholder={`Search in ${category.name}...`}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label={`Filter ${category.name} tools`}
                style={{ height: '46px', borderRadius: 'var(--radius-xl)' }}
              />
              {filter && (
                <button
                  type="button"
                  onClick={() => setFilter('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4,
                  }}
                  title="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {filteredTools.length > 0 ? (
              <motion.div
                key="tools-grid"
                className="grid grid-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                style={{ gap: 'var(--space-6)' }}
              >
                {filteredTools.map(tool => (
                  <motion.div key={tool.id} variants={itemVariants}>
                    <ToolCard tool={tool} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                className="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="empty-state-icon">
                  <PackageSearch size={28} style={{ color: 'var(--color-text-muted)' }} />
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--color-text)' }}>
                  No tools found matching &quot;{filter}&quot;
                </p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  Try a different search term or clear the filter.
                </p>
                <button
                  onClick={() => setFilter('')}
                  className="btn btn-secondary btn-sm"
                >
                  Clear Filter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
