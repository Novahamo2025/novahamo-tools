import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { getToolCount } from '../data/tools';
import CategoryVisual3D from './CategoryVisual3D';

export default function CategoryCard({ category }) {
  const Icon = category.icon;
  const toolCount = getToolCount(category.id);

  // 3D Tilt Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 280,
    damping: 24,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 280,
    damping: 24,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xVal = (e.clientX - rect.left) / rect.width - 0.5;
    const yVal = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xVal);
    y.set(yVal);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200, height: '100%' }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
    >
      <Link
        to={category.route}
        className="category-card-3d"
        style={{ '--cat-color': category.color }}
      >
        {/* Holographic glowing edge reflection */}
        <div className="cat-card-edge-glow" />

        {/* Top bar with icon and tool count */}
        <div className="cat-card-topbar">
          <div className="cat-card-icon-badge">
            <Icon size={24} />
          </div>
          <span className="cat-card-count-pill">
            <Sparkles size={11} /> {toolCount} tools
          </span>
        </div>

        {/* Bespoke 3D Animated Category Composition */}
        <div className="cat-card-visual-wrapper">
          <CategoryVisual3D categoryId={category.id} color={category.color} />
        </div>

        {/* Title and Description */}
        <div className="cat-card-body">
          <h3 className="cat-card-title">{category.name}</h3>
          <p className="cat-card-desc">{category.description}</p>
        </div>

        {/* Footer with action arrow */}
        <div className="cat-card-footer">
          <span className="cat-card-action-text">Launch Workspace</span>
          <div className="cat-card-arrow-disc">
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
