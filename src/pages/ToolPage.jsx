import { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import tools, { getToolsByCategory } from '../data/tools';
import { getCategoryById } from '../data/categories';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';

export default function ToolPage() {
  const { toolSlug } = useParams();
  const route = `/tool/${toolSlug}`;

  const tool = tools.find(t => t.route === route);

  if (!tool) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 className="section-title">Tool Not Found</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
            The tool you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const category = getCategoryById(tool.category);
  const ToolComponent = tool.component;

  const relatedTools = getToolsByCategory(tool.category)
    .filter(t => t.id !== tool.id && t.route !== tool.route)
    .slice(0, 4);

  return (
    <div className="tool-page">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: category?.name || 'Tools', path: category?.route || '/tools' },
          { label: tool.name },
        ]} />

        <div className="tool-header">
          <div className="tool-header-icon">
            {category?.icon && <category.icon size={24} />}
          </div>
          <h1 className="tool-title">{tool.name}</h1>
          <p className="tool-description">{tool.description}</p>
          {tool.externalDependency && (
            <div className="notification notification-info" style={{
              marginTop: 'var(--space-3)',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.15)',
              color: 'var(--color-info)',
              fontSize: '0.8125rem',
            }}>
              ℹ️ {tool.externalDependency}
            </div>
          )}
          {tool.processingType === 'client' && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              marginTop: 'var(--space-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}>
              🔒 All processing happens locally in your browser. Your files are never uploaded.
            </p>
          )}
        </div>

        <Suspense fallback={
          <div className="loading-overlay" style={{ minHeight: '300px' }}>
            <div className="spinner" />
            <span>Loading tool...</span>
          </div>
        }>
          <ToolComponent />
        </Suspense>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div style={{ marginTop: 'var(--space-12)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
              Related Tools
            </h2>
            <div className="grid grid-4">
              {relatedTools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
