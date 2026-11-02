import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  ChevronDown,
  CheckCircle2,
  Lock,
  Flame,
  Globe2
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import categories from '../data/categories';
import tools, { searchTools } from '../data/tools';
import CategoryCard from '../components/CategoryCard';
import ToolCard from '../components/ToolCard';
import HeroUniverse3D from '../components/HeroUniverse3D';

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ── Animated Count-Up Hook ── */
function useCountUp(target, duration = 1600) {
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

function StatItem({ value, suffix = '', label, icon }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="stat-pod-3d">
      <div className="stat-pod-icon">{icon}</div>
      <div className="stat-pod-data">
        <span className="stat-pod-number">
          {count}
          {suffix}
        </span>
        <span className="stat-pod-label">{label}</span>
      </div>
    </div>
  );
}

const FEATURED_IDS = [
  'text-to-qr',
  'image-resizer',
  'pdf-compressor',
  'pdf-merger',
  'video-trimmer',
  'json-formatter',
  'emi-calculator',
  'stopwatch'
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    return searchTools(searchQuery).slice(0, 10);
  }, [searchQuery]);

  const totalTools = tools.length;

  const featuredTools = useMemo(
    () => FEATURED_IDS.map(id => tools.find(t => t.id === id)).filter(Boolean),
    []
  );

  // Global keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="cinematic-homepage">
      {/* ══════════════════════════════════════════════════════
          1. IMMERSIVE 3D FULL-SCREEN HERO SECTION
      ══════════════════════════════════════════════════════ */}
      <section className="hero-universe-section">
        {/* Ambient energy background meshes */}
        <div className="hero-grid-mesh" />
        <div className="hero-radial-glow glow-top" />
        <div className="hero-radial-glow glow-center" />

        <div className="container hero-universe-layout">
          {/* Left Column: Cinematic Headline & Actions */}
          <motion.div
            className="hero-universe-content"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Holographic Brand Pill */}
            <motion.div variants={fadeUp} custom={0}>
              <div className="hero-holo-pill">
                <span className="pill-dot-pulse" />
                <span className="pill-text">NOVAHAMO TOOLS UNIVERSE</span>
                <span className="pill-chip">v2.0 3D</span>
              </div>
            </motion.div>

            {/* Main 3D Headline */}
            <motion.h1 className="hero-kinetic-title" variants={fadeUp} custom={1}>
              TOOLS THAT MAKE
              <br />
              <span className="text-neon-gradient">EVERYTHING EASIER.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="hero-kinetic-sub" variants={fadeUp} custom={2}>
              Step into an immersive suite of <strong>162+ high-performance online tools</strong>.
              Engineered with in-browser WebAssembly, Canvas, and zero-latency cryptographic processing.
              Your confidential files never leave your device.
            </motion.p>

            {/* Animated Search Bar with Keyboard Hint */}
            <motion.div className="hero-search-matrix" variants={fadeUp} custom={3}>
              <div className="search-bar-frame">
                <Search size={20} className="search-bar-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-bar-input"
                  placeholder="Search 162+ tools... (Try PDF Merge, QR, Image Resize)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search tools"
                />
                <div className="kbd-shortcut-hint">
                  <span>Ctrl</span> <span>K</span>
                </div>
              </div>

              {/* Instant Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="search-matrix-results">
                  {searchResults.map((tool) => (
                    <Link
                      key={tool.id}
                      to={tool.route}
                      className="matrix-result-row"
                      onClick={() => setSearchQuery('')}
                    >
                      <div className="result-main">
                        <span className="result-name">{tool.name}</span>
                        <span className="result-desc">{tool.description.substring(0, 75)}...</span>
                      </div>
                      <span className="result-cat-tag">{tool.category}</span>
                    </Link>
                  ))}
                </div>
              )}

              {searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div className="search-matrix-results empty-matrix">
                  <p>No tools matched &quot;{searchQuery}&quot;</p>
                  <span>Check spelling or explore categories below</span>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div className="hero-action-buttons" variants={fadeUp} custom={4}>
              <Link to="/tools" className="btn-neon-primary">
                <span>Explore All Tools</span>
                <ArrowRight size={18} />
              </Link>
              <a href="#tool-universe" className="btn-neon-ghost">
                <span>Discover 3D Categories</span>
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div className="hero-trust-matrix" variants={fadeUp} custom={5}>
              <span className="trust-node">
                <CheckCircle2 size={14} className="node-icon" /> 162+ Free Tools
              </span>
              <span className="trust-node">
                <Lock size={14} className="node-icon" /> 100% In-Browser Privacy
              </span>
              <span className="trust-node">
                <Zap size={14} className="node-icon" /> Zero Server Latency
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D WebGL Three.js Universe */}
          <motion.div
            className="hero-universe-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroUniverse3D />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <a href="#tool-universe" aria-label="Scroll to 3D Tool Universe">
            <span className="scroll-label">EXPLORE UNIVERSE</span>
            <ChevronDown size={18} className="scroll-bounce-arrow" />
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          2. QUANTUM METRICS STATS RIBBON
      ══════════════════════════════════════════════════════ */}
      <section className="stats-ribbon-section">
        <div className="container">
          <div className="stats-ribbon-grid">
            <StatItem value={totalTools} suffix="+" label="Ready Tools" icon={<Cpu size={24} />} />
            <div className="stat-separator" />
            <StatItem value={categories.length} label="Distinct 3D Domains" icon={<Layers size={24} />} />
            <div className="stat-separator" />
            <StatItem value={100} suffix="%" label="Free Forever" icon={<Sparkles size={24} />} />
            <div className="stat-separator" />
            <div className="stat-pod-3d">
              <div className="stat-pod-icon"><ShieldCheck size={24} /></div>
              <div className="stat-pod-data">
                <span className="stat-pod-number">100%</span>
                <span className="stat-pod-label">Client-Side Privacy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          3. SECTION A: WHY NOVAHAMO TOOLS? (THE DIGITAL ENGINE)
      ══════════════════════════════════════════════════════ */}
      <section className="section engine-pillars-section">
        <div className="container">
          <motion.div
            className="section-title-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-neon-badge">
              <Flame size={13} /> ARCHITECTURAL ADVANTAGE
            </div>
            <h2 className="section-mega-title">
              Why NovaHamo Tools Is Different.
            </h2>
            <p className="section-mega-sub">
              Built on WebAssembly, HTML5 Canvas, and modern Web Crypto APIs to deliver desktop-grade performance directly inside your browser.
            </p>
          </motion.div>

          <div className="grid grid-4 engine-grid" style={{ gap: 'var(--space-6)', marginTop: 'var(--space-10)' }}>
            {[
              {
                icon: Zap,
                title: 'Zero Latency Compute',
                desc: 'Processing runs locally using your computer’s hardware threads. No upload queues, no waiting for remote server conversions.',
                tag: 'INSTANT'
              },
              {
                icon: Lock,
                title: 'Confidential by Design',
                desc: 'Your photos, financial data, and sensitive legal PDFs never touch an external cloud. Data stays quarantined in your browser tab.',
                tag: 'PRIVATE'
              },
              {
                icon: Sparkles,
                title: 'Unlimited Freedom',
                desc: 'Zero subscriptions, no credit cards, no login gates, and absolutely no watermarks on your exported images or documents.',
                tag: '100% FREE'
              },
              {
                icon: Globe2,
                title: 'Cross-Platform Matrix',
                desc: 'Runs seamlessly across Windows, macOS, Linux, iOS, and Android. Fast responsive layout designed for small screens to 4K monitors.',
                tag: 'UNIVERSAL'
              }
            ].map((pillar, i) => (
              <motion.div
                key={i}
                className="engine-card-3d"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <div className="card-top-tag">{pillar.tag}</div>
                <div className="engine-card-icon">
                  <pillar.icon size={26} />
                </div>
                <h3 className="engine-card-title">{pillar.title}</h3>
                <p className="engine-card-desc">{pillar.desc}</p>
                <div className="card-corner-bracket" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          4. SECTION B: 3D TOOL UNIVERSE — 10 UNIQUE ENVIRONMENTS
      ══════════════════════════════════════════════════════ */}
      <section id="tool-universe" className="section universe-categories-section">
        <div className="container">
          <motion.div
            className="section-title-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-neon-badge">
              <Sparkles size={13} /> 10 UNIQUE 3D REALMS
            </div>
            <h2 className="section-mega-title">
              Enter The Tool Universe.
            </h2>
            <p className="section-mega-sub">
              Ten bespoke interactive domains built for productivity, media editing, development, calculations, and daily utilities.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-3 universe-grid"
            style={{ gap: 'var(--space-6)', marginTop: 'var(--space-12)' }}
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {categories.map((category, index) => (
              <motion.div key={category.id} variants={fadeUp} custom={index}>
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          5. SECTION C: HOW IT WORKS (3-STEP QUANTUM PIPELINE)
      ══════════════════════════════════════════════════════ */}
      <section className="section pipeline-section">
        <div className="container">
          <motion.div
            className="section-title-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-neon-badge">
              <Cpu size={13} /> QUANTUM WORKFLOW
            </div>
            <h2 className="section-mega-title">
              How It Works In 3 Steps.
            </h2>
            <p className="section-mega-sub">
              Zero complicated configurations. Instant client-side execution from selection to export.
            </p>
          </motion.div>

          <div className="pipeline-grid" style={{ marginTop: 'var(--space-12)' }}>
            {[
              {
                step: '01',
                title: 'Select Any Tool',
                desc: 'Pick from 162+ tools across 10 categories. No registration, no login, zero cookies.',
                icon: '⚡'
              },
              {
                step: '02',
                title: 'Client-Side Processing',
                desc: 'Your browser executes the computation instantly using WebAssembly and HTML5 Canvas.',
                icon: '⚙️'
              },
              {
                step: '03',
                title: 'Instant Download',
                desc: 'Download high-resolution images, pristine PDFs, and decoded files in seconds.',
                icon: '📦'
              }
            ].map((p, i) => (
              <motion.div
                key={i}
                className="pipeline-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                <div className="pipeline-step-pill">{p.step}</div>
                <div className="pipeline-icon-box">{p.icon}</div>
                <h3 className="pipeline-title">{p.title}</h3>
                <p className="pipeline-desc">{p.desc}</p>
                {i < 2 && <div className="pipeline-connector-line" />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          6. SECTION D: POPULAR TOOLS FAST LAUNCHPAD
      ══════════════════════════════════════════════════════ */}
      <section className="section launchpad-section">
        <div className="container">
          <motion.div
            className="section-title-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-neon-badge">
              <Zap size={13} /> RAPID ACCESS
            </div>
            <h2 className="section-mega-title">
              High-Velocity Tools.
            </h2>
            <p className="section-mega-sub">
              Instant entry into the tools creators, developers, and professionals use most.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-4"
            style={{ gap: 'var(--space-4)', marginTop: 'var(--space-10)' }}
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

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/tools" className="btn-neon-primary" style={{ display: 'inline-flex' }}>
              <span>Browse All 162+ Tools</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          7. SECTION E: FINAL CINEMATIC CTA
      ══════════════════════════════════════════════════════ */}
      <section className="section cta-reactor-section">
        <div className="container">
          <motion.div
            className="cta-reactor-stage"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="cta-reactor-core" />
            <div className="cta-energy-ring" />

            <span className="hero-holo-pill" style={{ marginBottom: 'var(--space-4)' }}>
              <CheckCircle2 size={13} />
              &nbsp;READY FOR IMMEDIATE USE
            </span>

            <h2 className="cta-mega-heading">
              YOUR DIGITAL TOOLKIT.
              <br />
              <span className="text-neon-gradient">ONE BEAUTIFUL PLACE.</span>
            </h2>

            <p className="cta-mega-sub">
              Never pay for utility software again. Join thousands of creators, engineers,
              and students using NovaHamo Tools every day.
            </p>

            <div className="cta-action-row">
              <Link to="/tools" className="btn-neon-primary btn-lg">
                <span>Start Using Tools</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/categories" className="btn-neon-ghost btn-lg">
                <span>Explore Categories</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
