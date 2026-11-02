import { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import tools, { getToolsByCategory } from '../data/tools';
import { getCategoryById } from '../data/categories';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';
import ToolIcon from '../components/ToolIcon';

function ToolSkeleton() {
  return (
    <div className="card" style={{
      minHeight: '380px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-4)',
      background: 'var(--color-card)',
    }}>
      <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
        Loading tool workspace...
      </span>
    </div>
  );
}

export default function ToolPage() {
  const { toolSlug } = useParams();
  const route = `/tool/${toolSlug}`;

  const tool = tools.find(t => t.id === toolSlug || t.route === route);

  if (!tool) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-4)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="section-title">Tool Not Found</h1>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', maxWidth: 440, margin: '0 auto var(--space-6)' }}>
              The tool you're looking for doesn't exist or has been moved to a new route.
            </p>
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  const category = getCategoryById(tool.category);
  const ToolComponent = tool.component;

  const relatedTools = getToolsByCategory(tool.category)
    .filter(t => t.id !== tool.id && t.route !== tool.route)
    .slice(0, 4);

  const catColor = category?.color || '#16A34A';

  return (
    <div className="tool-page">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: category?.name || 'Tools', path: category?.route || '/tools' },
          { label: tool.name },
        ]} />

        {/* Premium Tool Header */}
        <motion.div
          className="tool-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: 'var(--space-8)' }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div style={{ flexShrink: 0 }}>
              <ToolIcon toolId={tool.id} category={tool.category} size="lg" />
            </div>

            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <h1 className="tool-title" style={{ margin: 0, fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)' }}>
                  {tool.name}
                </h1>
                {tool.processingType === 'client' && (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--color-primary)',
                    backgroundColor: 'var(--color-primary-bg)',
                    border: '1px solid var(--color-border)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}>
                    <ShieldCheck size={13} /> Private & Local
                  </span>
                )}
              </div>

              <p className="tool-description" style={{ marginTop: 'var(--space-1)', marginBottom: 0 }}>
                {tool.description}
              </p>

              {tool.externalDependency && (
                <div className="notification notification-info" style={{
                  marginTop: 'var(--space-3)',
                  backgroundColor: 'rgba(59, 130, 246, 0.08)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: 'var(--color-info)',
                  fontSize: '0.8125rem',
                  padding: 'var(--space-2) var(--space-4)',
                }}>
                  ℹ️ {tool.externalDependency}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tool Component Workspace */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Suspense fallback={<ToolSkeleton />}>
            <ToolComponent />
          </Suspense>
        </motion.div>

        {/* Related Tools Section */}
        {relatedTools.length > 0 && (
          <motion.div
            style={{ marginTop: 'var(--space-16)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  More {category?.name || 'Related Tools'}
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Discover other tools in this category.
                </p>
              </div>
              {category && (
                <Link to={category.route} className="btn btn-secondary btn-sm">
                  View All {category.name} →
                </Link>
              )}
            </div>

            <div className="grid grid-4" style={{ gap: 'var(--space-4)' }}>
              {relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
