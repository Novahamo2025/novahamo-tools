import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import categories from '../data/categories';
import tools, { searchTools } from '../data/tools';
import CategoryCard from '../components/CategoryCard';
import ToolCard from '../components/ToolCard';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return searchTools(searchQuery).slice(0, 12);
  }, [searchQuery]);

  const totalTools = tools.length;

  return (
    <div>
      {/* Hero */}
      <section style={{
        padding: 'var(--space-12) 0 var(--space-10)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="container">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
              backgroundColor: 'var(--color-primary-bg)',
              padding: 'var(--space-1) var(--space-4)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--space-4)',
            }}>
              NOVAHAMO TOOLS
            </span>

            <h1 style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: 'var(--space-4)',
              maxWidth: '700px',
              margin: '0 auto var(--space-4)',
            }}>
              All Your Essential Tools in One Place
            </h1>

            <p style={{
              fontSize: 'clamp(0.9375rem, 2vw, 1.125rem)',
              color: 'var(--color-text-secondary)',
              maxWidth: '640px',
              margin: '0 auto var(--space-8)',
              lineHeight: 1.6,
            }}>
              Work smarter with free online tools for images, PDFs, QR codes, video, documents, coding, calculations, and everyday tasks.
            </p>

            {/* Search */}
            <div style={{
              maxWidth: '560px',
              margin: '0 auto var(--space-6)',
              position: 'relative',
            }}>
              <div style={{ position: 'relative' }}>
                <Search size={20} style={{
                  position: 'absolute',
                  left: 'var(--space-4)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }} />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search tools... Try PDF Compressor, QR Generator, Image Resizer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: 'var(--space-10)',
                    height: '52px',
                    fontSize: '1rem',
                    borderRadius: 'var(--radius-xl)',
                  }}
                  aria-label="Search tools"
                />
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: 'var(--space-2)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 50,
                  textAlign: 'left',
                }}>
                  {searchResults.map(tool => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      style={{
                        display: 'block',
                        padding: 'var(--space-3) var(--space-4)',
                        borderBottom: '1px solid var(--color-border-light)',
                        textDecoration: 'none',
                        color: 'var(--color-text)',
                        transition: 'background-color var(--transition-fast)',
                      }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--color-primary-bg)'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{tool.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                        {tool.description.substring(0, 80)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  marginTop: 'var(--space-2)',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-xl)',
                  padding: 'var(--space-6)',
                  textAlign: 'center',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.875rem',
                  zIndex: 50,
                }}>
                  No tools found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-6)',
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              flexWrap: 'wrap',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Shield size={14} /> All processing happens in your browser
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <Zap size={14} /> {totalTools}+ free tools available
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Find the right tool for your task across {categories.length} organized categories.
            </p>
          </div>

          <div className="grid grid-4" style={{ gap: 'var(--space-5)' }}>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{
        backgroundColor: 'var(--color-primary-bg)',
        textAlign: 'center',
      }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
            Ready to get started?
          </h2>
          <p style={{
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--space-6)',
            maxWidth: '480px',
            margin: '0 auto var(--space-6)',
          }}>
            All tools are free to use. No registration, no login, no watermarks.
          </p>
          <Link to="/tools" className="btn btn-primary btn-lg">
            Explore All Tools <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
