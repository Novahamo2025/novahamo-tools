import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryColors = {
  qr: '#16A34A',
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

const categoryEmojis = {
  qr: '📱',
  images: '🖼️',
  pdf: '📄',
  'video-audio': '🎬',
  'student-job': '🎓',
  'social-media': '📲',
  text: '✍️',
  developer: '💻',
  calculators: '🧮',
  everyday: '🔧',
};

function getCategoryColor(category) {
  return categoryColors[category] || '#16A34A';
}

function getCategoryEmoji(category) {
  return categoryEmojis[category] || '🔧';
}

export default function ToolCard({ tool }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{ height: '100%' }}
    >
      <Link
        to={tool.route}
        className="tool-card"
        style={{ '--tool-color': getCategoryColor(tool.category) }}
      >
        <div className="tool-card-inner">
          <div className="tool-card-icon">
            <span>{getCategoryEmoji(tool.category)}</span>
          </div>
          <div className="tool-card-content">
            <h3 className="tool-card-title">{tool.name}</h3>
            <p className="tool-card-desc">{tool.description}</p>
          </div>
          <div className="tool-card-arrow">
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
