import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import categories from '../data/categories';
import tools, { searchTools } from '../data/tools';
import CategoryCard from '../components/CategoryCard';
import ToolCard from '../components/ToolCard';

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ── animated count-up hook ── */
function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);

  return { count, ref };
}

/* ── floating tile ── */
const FloatingTile = ({ icon, label, color, delay, style }) => (
  <motion.div
    className="floating-tile"
    style={{ '--tile-color': color, ...style }}
    animate={{ y: [0, -12, 0] }}
    transition={{ duration: 4 + delay * 0.6, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <span style={{ fontSize: '1.1rem' }}>{icon}</span>
    <span>{label}</span>
  </motion.div>
);

/* ── glowing orb ── */
const Orb = ({ color, size, style }) => (
  <div
    className="hero-orb"
    style={{ '--orb-color': color, '--orb-size': size, ...style }}
  />
);

/* ── stats item with count-up ── */
function StatItem({ value, suffix = '', label }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="stats-item">
      <span className="stats-value">
        {count}
        {suffix}
      </span>
      <span className="stats-label">{label}</span>
    </div>
  );
}

/* ── popular tool ids to feature ── */
const FEATURED_IDS = [
  'text-to-qr', 'url-to-qr', 'image-resizer', 'pdf-compressor',
  'image-compressor', 'word-counter', 'json-formatter', 'bmi-calculator',
];

export default function HomePage() {
  /* ── preserved search logic ── */
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return searchTools(searchQuery).slice(0, 12);
  }, [searchQuery]);

  const totalTools = tools.length;

  /* ── featured tools ── */
  const featuredTools = useMemo(
    () =>
      FEATURED_IDS.map((id) => tools.find((t) => t.id === id)).filter(Boolean).slice(0, 8),
    [],
  );

  return (
    <div className="homepage">
      {/* ══════════════════ HERO ══════════════════ */}
      <section className="hero-section">
        <div className="container hero-container">
          {/* LEFT column */}
          <motion.div
            className="hero-left"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={fadeUp} custom={0}>
              <span className="hero-badge">
                <span className="hero-badge-dot" />
                NOVAHAMO TOOLS
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
              <span className="hero-title-gradient">Everything You Need.</span>
              <br />
              Nothing You Don't.
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
              Work smarter with free online tools for images, PDFs, QR codes,
              video, documents, coding, calculations, and everyday tasks — right
              in your browser.
            </motion.p>

            {/* Search bar */}
            <motion.div className="hero-search-wrap" variants={fadeUp} custom={3}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  className="input-field hero-search-input"
                  placeholder="Search tools… PDF Compressor, QR Generator, Image Resizer"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search tools"
                />
              </div>

              {/* Search results dropdown */}
              {searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="search-result-item"
                      onClick={() => setSearchQuery('')}
                    >
                      <span className="search-result-name">{tool.name}</span>
                      <span className="search-result-desc">
                        {tool.description.substring(0, 72)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="search-dropdown search-no-results">
                  No tools found for &quot;{searchQuery}&quot;
                </div>
              )}
            </motion.div>

            {/* CTA buttons */}
            <motion.div className="hero-ctas" variants={fadeUp} custom={4}>
              <Link to="/tools" className="btn btn-primary btn-lg">
                Explore All Tools <ArrowRight size={18} />
              </Link>
              <Link to="/categories" className="btn btn-secondary btn-lg">
                Discover Categories
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div className="hero-trust" variants={fadeUp} custom={5}>
              {[
                `✓ ${totalTools}+ Free Tools`,
                '✓ No Registration',
                '✓ 100% Browser-Based',
              ].map((text) => (
                <span key={text} className="hero-trust-item">
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT column – floating composition */}
          <motion.div
            className="hero-right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden="true"
          >
            <div className="hero-composition">
              {/* Soft glow orbs */}
              <Orb color="#16A34A" size="340px" style={{ top: '10%', left: '15%', opacity: 0.18 }} />
              <Orb color="#22C55E" size="200px" style={{ bottom: '20%', right: '10%', opacity: 0.14 }} />
              <Orb color="#064E3B" size="160px" style={{ top: '55%', left: '5%', opacity: 0.12 }} />
              <Orb color="#A7F3D0" size="120px" style={{ top: '5%', right: '20%', opacity: 0.1 }} />

              {/* Floating tool tiles */}
              <FloatingTile icon="📱" label="QR Generator" color="#16A34A" delay={0}
                style={{ top: '8%', left: '12%' }} />
              <FloatingTile icon="📄" label="PDF Merge" color="#EF4444" delay={0.8}
                style={{ top: '22%', right: '4%' }} />
              <FloatingTile icon="🖼️" label="Image Resize" color="#3B82F6" delay={1.4}
                style={{ top: '48%', left: '2%' }} />
              <FloatingTile icon="💻" label="JSON Format" color="#10B981" delay={0.4}
                style={{ top: '60%', right: '8%' }} />
              <FloatingTile icon="🧮" label="EMI Calc" color="#6366F1" delay={1.0}
                style={{ bottom: '18%', left: '22%' }} />
              <FloatingTile icon="🎬" label="Video Trim" color="#8B5CF6" delay={1.8}
                style={{ bottom: '5%', right: '15%' }} />

              {/* Central decorative card */}
              <motion.div
                className="hero-central-card"
                animate={{ y: [0, -8, 0], rotate: [0, 0.5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="hero-central-card-icon">⚡</div>
                <div className="hero-central-card-text">
                  <span className="hero-central-card-label">NovaHamo Tools</span>
                  <span className="hero-central-card-sub">{totalTools}+ free tools ready</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ STATS BAR ══════════════════ */}
      <section className="stats-section">
        <div className="container">
          <motion.div
            className="stats-bar"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <StatItem value={totalTools} suffix="+" label="Tools" />
            <div className="stats-divider" />
            <StatItem value={categories.length} label="Categories" />
            <div className="stats-divider" />
            <StatItem value={100} suffix="%" label="Free" />
            <div className="stats-divider" />
            <div className="stats-item">
              <span className="stats-value">🔒</span>
              <span className="stats-label">Browser-Based</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CATEGORIES ══════════════════ */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Find the right tool across {categories.length} organised categories.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-4"
            style={{ gap: 'var(--space-5)', marginTop: 'var(--space-8)' }}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {categories.map((category, index) => (
              <motion.div key={category.id} variants={fadeUp} custom={index}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ FEATURED TOOLS STRIP ══════════════════ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Popular Tools</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Jump straight into the tools people use most.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-4"
            style={{ gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {featuredTools.map((tool, index) => (
              <motion.div key={tool.id} variants={fadeUp} custom={index}>
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-inner"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-glow" />
            <span className="hero-badge" style={{ marginBottom: 'var(--space-4)' }}>
              <CheckCircle2 size={12} />
              &nbsp;Always Free
            </span>
            <h2 className="cta-title">Start Using NovaHamo Tools</h2>
            <p className="cta-subtitle">
              No sign-ups, no watermarks, no limits. All tools work right in your
              browser.
            </p>
            <div className="hero-ctas" style={{ justifyContent: 'center' }}>
              <Link to="/tools" className="btn btn-primary btn-lg">
                Explore All Tools <ArrowRight size={18} />
              </Link>
              <Link to="/categories" className="btn btn-secondary btn-lg">
                Discover Categories
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
