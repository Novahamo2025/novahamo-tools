import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getToolCount } from '../data/tools';

export default function CategoryCard({ category }) {
  const Icon = category.icon;
  const toolCount = getToolCount(category.id);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <Link
        to={category.route}
        className="category-card"
        style={{ '--cat-color': category.color }}
      >
        {/* Decorative background pattern */}
        <div className="category-card-bg-pattern" />

        {/* Icon */}
        <div className="category-card-icon">
          <Icon size={28} />
        </div>

        {/* Content */}
        <h3 className="category-card-title">{category.name}</h3>
        <p className="category-card-desc">{category.description}</p>

        {/* Footer */}
        <div className="category-card-footer">
          <span className="category-card-count">{toolCount} tools</span>
          <span className="category-card-explore">Explore →</span>
        </div>
      </Link>
    </motion.div>
  );
}
