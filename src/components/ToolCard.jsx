import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ToolIcon, { TOOL_ICON_MAP } from './ToolIcon';

const categoryColors = {
  qr: '#22C55E',
  images: '#3B82F6',
  pdf: '#EF4444',
  'video-audio': '#8B5CF6',
  'student-job': '#F59E0B',
  'social-media': '#EC4899',
  text: '#06B6D4',
  developer: '#10B981',
  calculators: '#6366F1',
  everyday: '#F97316',
};

const categoryNames = {
  qr: 'QR Code',
  images: 'Image',
  pdf: 'PDF',
  'video-audio': 'Media',
  'student-job': 'Student',
  'social-media': 'Social',
  text: 'Text',
  developer: 'Developer',
  calculators: 'Calculator',
  everyday: 'Utility',
};

export default function ToolCard({ tool }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const iconConfig = TOOL_ICON_MAP[tool.id] || {};
  const toolColor = iconConfig.color || categoryColors[tool.category] || '#22C55E';
  const badge = iconConfig.badge || categoryNames[tool.category] || 'TOOL';

  // 3D Tilt Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 320, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 320, damping: 24 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xVal);
    mouseY.set(yVal);
    setMousePos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        height: '100%',
      }}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="tool-card-wrapper"
    >
      <Link
        to={tool.route}
        className="tool-card-3d"
        style={{
          '--tool-theme-color': toolColor,
          '--spotlight-x': `${mousePos.x}%`,
          '--spotlight-y': `${mousePos.y}%`,
        }}
      >
        {/* Dynamic 3D Cursor Spotlight Overlay */}
        <div className="tool-card-spotlight" />

        {/* Ambient Top Glow Line */}
        <div className="tool-card-glow-bar" />

        {/* Card Header: 3D Tool Icon + Badges */}
        <div className="tool-card-top">
          <div className="tool-card-icon-anchor">
            <ToolIcon
              toolId={tool.id}
              category={tool.category}
              size="md"
              className={isHovered ? 'tool-icon-hovered' : ''}
            />
          </div>

          <div className="tool-card-meta-tags">
            {badge && (
              <span className="tool-format-pill">
                {badge}
              </span>
            )}
            {tool.processingType === 'client' && (
              <span className="tool-privacy-pill" title="100% Client-Side In-Browser Processing">
                <ShieldCheck size={11} /> Private
              </span>
            )}
          </div>
        </div>

        {/* Card Body: Title & Description */}
        <div className="tool-card-body">
          <h3 className="tool-card-title">
            {tool.name}
          </h3>
          <p className="tool-card-desc">
            {tool.description}
          </p>
        </div>

        {/* Card Footer: Category Label + Sleek Launch Disc */}
        <div className="tool-card-footer">
          <span className="tool-card-cat-badge">
            {categoryNames[tool.category] || tool.category}
          </span>

          <div className="tool-card-launch-disc">
            <span className="tool-card-launch-text">Launch</span>
            <ArrowRight size={13} className="tool-card-launch-arrow" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
