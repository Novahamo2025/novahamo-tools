import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/**
 * HeroUniverse3D:
 * An interactive WebGL 3D technology core featuring an orbiting wireframe geometry,
 * gyro energy rings, and an interactive particle galaxy that responds to mouse coordinates.
 * Paired with floating 3D holographic tool objects.
 */
export default function HeroUniverse3D() {
  const mountRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));

  // Mouse tilt for floating holographic cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebGL Three.js Scene Setup
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 24;

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);
    } catch {
      return; // WebGL not supported, gracefully fallback
    }

    // ── 1. Central Core: Dual Wireframe Icosahedron ──
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer wireframe sphere
    const outerGeo = new THREE.IcosahedronGeometry(5.2, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Inner geometric nucleus
    const innerGeo = new THREE.OctahedronGeometry(2.8, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x6dff9a,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Inner glowing light orb
    const nucleusGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.85,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // ── 2. Gyro Orbit Energy Rings ──
    const ringGroup = new THREE.Group();
    scene.add(ringGroup);

    const createRing = (radius, tube, color, opacity, rotX, rotY) => {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      ringGroup.add(ring);
      return ring;
    };

    const ring1 = createRing(7.2, 0.05, 0x22c55e, 0.5, Math.PI / 3, 0);
    const ring2 = createRing(8.4, 0.04, 0x6dff9a, 0.4, -Math.PI / 4, Math.PI / 6);
    const ring3 = createRing(9.6, 0.03, 0x10b981, 0.3, Math.PI / 6, -Math.PI / 3);

    // ── 3. Particle Galaxy ──
    const particleCount = isMobile ? 350 : 850;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x22c55e);
    const colorB = new THREE.Color(0x6dff9a);
    const colorC = new THREE.Color(0x064e3b);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Distribute in a spherical cloud around core
      const radius = 6 + Math.random() * 16;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const mixedColor = Math.random() > 0.5 ? colorA : Math.random() > 0.5 ? colorB : colorC;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ── 4. Mouse Interactive Parallax Tracking ──
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.8;
      targetY = y * 0.8;

      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Resize handler
    const handleResizeScene = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResizeScene);

    // ── 5. Render Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth core rotations
      coreGroup.rotation.y = elapsedTime * 0.25;
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.2;

      innerMesh.rotation.y = -elapsedTime * 0.45;
      innerMesh.rotation.z = elapsedTime * 0.3;

      // Pulse nucleus
      const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.15;
      nucleusMesh.scale.set(scale, scale, scale);

      // Orbit rings
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.25;
      ring3.rotation.z = elapsedTime * 0.18;

      // Particle galaxy slow swirl
      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.x = Math.cos(elapsedTime * 0.04) * 0.08;

      // Camera parallax response
      camera.position.x += (targetX * 3 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 3 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResizeScene);
      cancelAnimationFrame(animationFrameId);

      // Dispose WebGL resources
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isMobile, mouseX, mouseY]);

  return (
    <div className="hero-universe-container">
      {/* Three.js 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="hero-webgl-canvas" />

      {/* Floating 3D Holographic Tool Cards with Real-Time Perspective */}
      <motion.div
        className="hero-floating-universe"
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
      >
        {/* Card 1: 3D Holographic QR Matrix */}
        <motion.div
          className="holo-card holo-qr"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="holo-card-glow" />
          <div className="holo-qr-matrix">
            <div className="qr-laser-scanner" />
            <div className="qr-matrix-dots" />
          </div>
          <div className="holo-card-meta">
            <span className="holo-badge-neon">QR Matrix</span>
            <span className="holo-title">Instant Encode</span>
          </div>
        </motion.div>

        {/* Card 2: 3D PDF Translucent Layer */}
        <motion.div
          className="holo-card holo-pdf"
          animate={{ y: [0, -18, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        >
          <div className="holo-card-glow red-glow" />
          <div className="holo-pdf-preview">
            <div className="pdf-sheet sheet-back" />
            <div className="pdf-sheet sheet-mid" />
            <div className="pdf-sheet sheet-front">
              <span className="pdf-chip">PDF 4.0</span>
              <div className="pdf-line line-1" />
              <div className="pdf-line line-2" />
            </div>
          </div>
          <div className="holo-card-meta">
            <span className="holo-badge-neon red">Document Core</span>
            <span className="holo-title">Merge & Compress</span>
          </div>
        </motion.div>

        {/* Card 3: 3D Image Canvas Aperture */}
        <motion.div
          className="holo-card holo-img"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        >
          <div className="holo-card-glow blue-glow" />
          <div className="holo-img-target">
            <div className="target-reticle" />
            <div className="target-grid" />
            <div className="target-crosshair" />
          </div>
          <div className="holo-card-meta">
            <span className="holo-badge-neon blue">Studio Vision</span>
            <span className="holo-title">Pixel Processing</span>
          </div>
        </motion.div>

        {/* Card 4: Audio Equalizer Hologram */}
        <motion.div
          className="holo-card holo-audio"
          animate={{ y: [0, -16, 0], rotate: [0, -1, 0] }}
          transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        >
          <div className="holo-card-glow purple-glow" />
          <div className="holo-audio-wave">
            {[65, 90, 40, 100, 75, 45, 85, 30, 95, 60].map((h, i) => (
              <span
                key={i}
                className="eq-bar"
                style={{
                  '--h': `${h}%`,
                  animationDelay: `${i * 0.12}s`,
                }}
              />
            ))}
          </div>
          <div className="holo-card-meta">
            <span className="holo-badge-neon purple">Sound Spectrum</span>
            <span className="holo-title">Lossless Convert</span>
          </div>
        </motion.div>

        {/* Card 5: 3D Terminal IDE Node */}
        <motion.div
          className="holo-card holo-code"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.0, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
        >
          <div className="holo-card-glow cyan-glow" />
          <div className="holo-terminal-view">
            <div className="terminal-dots">
              <span className="dot red-dot" />
              <span className="dot yellow-dot" />
              <span className="dot green-dot" />
            </div>
            <code>
              <span className="token-keyword">async</span> (<span className="token-arg">buffer</span>) =&gt; &#123;
              <br />
              &nbsp;&nbsp;<span className="token-func">return</span> compute(buffer);
              <br />
              &#125;
            </code>
          </div>
          <div className="holo-card-meta">
            <span className="holo-badge-neon cyan">Dev Engine</span>
            <span className="holo-title">Zero Server Latency</span>
          </div>
        </motion.div>

        {/* Card 6: Quantum Calculator Orbit */}
        <motion.div
          className="holo-card holo-calc"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
        >
          <div className="holo-card-glow amber-glow" />
          <div className="calc-quantum-symbols">
            <span className="q-sym">∑</span>
            <span className="q-sym">π</span>
            <span className="q-sym">√</span>
            <span className="q-sym">%</span>
          </div>
          <div className="holo-card-meta">
            <span className="holo-badge-neon amber">Math Matrix</span>
            <span className="holo-title">High Precision</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
