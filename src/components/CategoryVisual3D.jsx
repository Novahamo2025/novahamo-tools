/**
 * CategoryVisual3D:
 * Renders 10 bespoke, futuristic 3D animated visual objects—one for each category.
 * Each visual composition has a distinct kinetic identity, glowing particle accents,
 * and holographic lighting.
 */
export default function CategoryVisual3D({ categoryId, color }) {
  switch (categoryId) {
    case 'qr':
      return <QRHoloCube color={color} />;
    case 'images':
      return <ImageAperture3D color={color} />;
    case 'pdf':
      return <PDFStackPages3D color={color} />;
    case 'video-audio':
      return <VideoEqualizerTimeline3D color={color} />;
    case 'student-job':
      return <DiplomaHonorScroll3D color={color} />;
    case 'social-media':
      return <CreatorMediaMatrix3D color={color} />;
    case 'text':
      return <TypographyGlyphMatrix3D color={color} />;
    case 'developer':
      return <TerminalCodeMatrix3D color={color} />;
    case 'calculators':
      return <QuantumMathRing3D color={color} />;
    case 'everyday':
      return <ChronographGear3D color={color} />;
    default:
      return <Default3DVisual color={color} />;
  }
}

/* ── 1. QR Hologram Cube with Scanning Laser ── */
function QRHoloCube({ color }) {
  return (
    <div className="cat-visual-box cat-visual-qr" style={{ '--accent': color }}>
      <div className="holo-qr-cube">
        <div className="qr-laser-line" />
        <div className="qr-cube-face">
          <div className="qr-matrix-corner tl" />
          <div className="qr-matrix-corner tr" />
          <div className="qr-matrix-corner bl" />
          <div className="qr-center-bits" />
        </div>
      </div>
    </div>
  );
}

/* ── 2. Image Aperture & Layered Frames ── */
function ImageAperture3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-img" style={{ '--accent': color }}>
      <div className="aperture-ring-outer">
        <div className="aperture-blade blade-1" />
        <div className="aperture-blade blade-2" />
        <div className="aperture-blade blade-3" />
        <div className="aperture-center-lens" />
      </div>
      <div className="floating-frame frame-back" />
      <div className="floating-frame frame-front" />
    </div>
  );
}

/* ── 3. Translucent PDF Stacked Pages with Page-Turn ── */
function PDFStackPages3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-pdf" style={{ '--accent': color }}>
      <div className="pdf-stack">
        <div className="pdf-page page-depth-3" />
        <div className="pdf-page page-depth-2" />
        <div className="pdf-page page-depth-1">
          <span className="pdf-badge-tag">PDF</span>
          <div className="page-shimmer-line l1" />
          <div className="page-shimmer-line l2" />
          <div className="page-curl-corner" />
        </div>
      </div>
    </div>
  );
}

/* ── 4. Cinematic Video Viewfinder & Live Equalizer Waves ── */
function VideoEqualizerTimeline3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-video" style={{ '--accent': color }}>
      <div className="video-cinema-viewport">
        <div className="video-play-orb">▶</div>
        <div className="video-eq-bars">
          {[40, 85, 60, 100, 70, 90, 50].map((h, i) => (
            <span
              key={i}
              className="v-bar"
              style={{
                '--vh': `${h}%`,
                animationDelay: `${i * 0.14}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="video-timeline-track">
        <div className="timeline-scrubber" />
      </div>
    </div>
  );
}

/* ── 5. Student & Job Holographic Diploma Scroll ── */
function DiplomaHonorScroll3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-student" style={{ '--accent': color }}>
      <div className="diploma-card">
        <div className="graduation-mortarboard">🎓</div>
        <div className="diploma-lines">
          <span className="d-line" />
          <span className="d-line short" />
        </div>
        <div className="gold-wax-seal">★</div>
      </div>
    </div>
  );
}

/* ── 6. Creator Media Matrix with Pulse Reactions ── */
function CreatorMediaMatrix3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-social" style={{ '--accent': color }}>
      <div className="creator-phone-frame">
        <div className="social-stream-card">
          <span className="reaction-bubble heart">❤️</span>
          <span className="reaction-bubble fire">🔥</span>
          <div className="social-metric-pill">
            <span className="metric-dot" />
            <span>4.9K</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 7. Cascading Typography & Glyph Matrix ── */
function TypographyGlyphMatrix3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-text" style={{ '--accent': color }}>
      <div className="glyph-cascade-matrix">
        <span className="glyph glyph-1">A</span>
        <span className="glyph glyph-2">¶</span>
        <span className="glyph glyph-3">&#123;&#125;</span>
        <span className="glyph glyph-4">&sect;</span>
        <div className="typewriter-cursor-beam" />
      </div>
    </div>
  );
}

/* ── 8. 3D Floating Code IDE Window ── */
function TerminalCodeMatrix3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-dev" style={{ '--accent': color }}>
      <div className="code-window-3d">
        <div className="window-header">
          <span className="win-dot" />
          <span className="win-dot" />
          <span className="win-dot" />
        </div>
        <div className="code-snippet">
          <span className="kw">const</span> tools = <span className="str">&apos;162+&apos;</span>;
          <br />
          <span className="func">optimize</span>(tools);
        </div>
      </div>
    </div>
  );
}

/* ── 9. Quantum Geometric Math Ring ── */
function QuantumMathRing3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-calc" style={{ '--accent': color }}>
      <div className="quantum-math-ring">
        <span className="math-op op-1">∑</span>
        <span className="math-op op-2">π</span>
        <span className="math-op op-3">√</span>
        <span className="math-op op-4">%</span>
        <div className="math-ring-center">=</div>
      </div>
    </div>
  );
}

/* ── 10. Chronograph Precision Gear & Orbit Ring ── */
function ChronographGear3D({ color }) {
  return (
    <div className="cat-visual-box cat-visual-everyday" style={{ '--accent': color }}>
      <div className="chronograph-dial">
        <div className="dial-notch-ring" />
        <div className="dial-second-hand" />
        <div className="dial-center-pin" />
      </div>
      <div className="gear-tooth-outer" />
    </div>
  );
}

/* ── Default Fallback ── */
function Default3DVisual({ color }) {
  return (
    <div className="cat-visual-box" style={{ '--accent': color }}>
      <div className="default-orb" />
    </div>
  );
}
