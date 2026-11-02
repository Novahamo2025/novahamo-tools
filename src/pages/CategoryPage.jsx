import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowLeft, PackageSearch } from 'lucide-react';
import categories, { getCategoryBySlug } from '../data/categories';
import { getToolsByCategory } from '../data/tools';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';
import CategoryCard from '../components/CategoryCard';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
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

  // If no slug, show all categories
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
            <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
              All Categories
            </h1>
            <p className="section-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
              Browse {categories.length} tool categories.
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
    <div>
      {/* Hero Section */}
      <div className="category-page-hero" style={{ '--cat-color': category.color }}>
        <div className="container">
          <Breadcrumbs items={[
            { label: 'Home', path: '/' },
            { label: 'Categories', path: '/categories' },
            { label: category.name },
          ]} />
          <div className="category-page-header">
            <motion.div
              className="category-page-icon"
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'backOut' }}
            >
              <Icon size={36} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <h1 style={{ fontSize: 'clamp(1.375rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.35rem' }}>
                {category.name}
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', maxWidth: 560 }}>
                {category.description}
              </p>
              <span className="category-page-count">
                {categoryTools.length} tool{categoryTools.length !== 1 ? 's' : ''} available
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filter Bar + Grid */}
      <div className="section" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="container">
          <div className="category-page-filter">
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}
              {filter.trim() ? ' found' : ' in this category'}
            </span>
            <div className="filter-search-wrap">
              <Search size={15} />
              <input
                type="text"
                className="input-field"
                placeholder="Filter tools..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter tools in this category"
              />
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
                <p style={{ fontSize: '1.0625rem', fontWeight: 700, marginBottom: '0.375rem', color: 'var(--color-text)' }}>
                  No tools match your filter
                </p>
                <p style={{ fontSize: '0.875rem' }}>Try a different search term</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
