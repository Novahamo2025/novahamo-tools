import {
  QrCode, Image, FileText, Video, GraduationCap,
  Share2, Type, Code2, Calculator, Wrench
} from 'lucide-react';

const categories = [
  {
    id: 'qr',
    name: 'QR Code Tools',
    slug: 'qr',
    description: 'Generate, customize, and scan QR codes for text, URLs, Wi-Fi, contacts, payments, and more.',
    icon: QrCode,
    color: '#15803D',
    route: '/tools/qr',
  },
  {
    id: 'images',
    name: 'Image & Photo Tools',
    slug: 'images',
    description: 'Resize, compress, convert, crop, watermark, and enhance your images easily.',
    icon: Image,
    color: '#3B82F6',
    route: '/tools/images',
  },
  {
    id: 'pdf',
    name: 'PDF & Document Tools',
    slug: 'pdf',
    description: 'Merge, split, compress, convert, sign, and edit PDFs and documents.',
    icon: FileText,
    color: '#EF4444',
    route: '/tools/pdf',
  },
  {
    id: 'video-audio',
    name: 'Video & Audio Tools',
    slug: 'video-audio',
    description: 'Trim, convert, compress, merge, and edit video and audio files.',
    icon: Video,
    color: '#8B5CF6',
    route: '/tools/video-audio',
  },
  {
    id: 'student-job',
    name: 'Student & Job Tools',
    slug: 'student-job',
    description: 'Build resumes, calculate CGPA, practice typing, and prepare for applications.',
    icon: GraduationCap,
    color: '#F59E0B',
    route: '/tools/student-job',
  },
  {
    id: 'social-media',
    name: 'Social Media & Creator Tools',
    slug: 'social-media',
    description: 'Create thumbnails, resize images, generate captions, and design for social platforms.',
    icon: Share2,
    color: '#EC4899',
    route: '/tools/social-media',
  },
  {
    id: 'text',
    name: 'Text & Writing Tools',
    slug: 'text',
    description: 'Count words, convert text cases, generate lorem ipsum, and work with text utilities.',
    icon: Type,
    color: '#06B6D4',
    route: '/tools/text',
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    slug: 'developer',
    description: 'Format JSON, encode Base64, generate UUIDs, test regex, and more dev utilities.',
    icon: Code2,
    color: '#10B981',
    route: '/tools/developer',
  },
  {
    id: 'calculators',
    name: 'Calculators & Converters',
    slug: 'calculators',
    description: 'Calculate EMI, SIP, GST, BMI, discounts, convert units, and more.',
    icon: Calculator,
    color: '#6366F1',
    route: '/tools/calculators',
  },
  {
    id: 'everyday',
    name: 'Useful Everyday Tools',
    slug: 'everyday',
    description: 'Stopwatch, timer, dice roller, notepad, barcode tools, and daily utilities.',
    icon: Wrench,
    color: '#F97316',
    route: '/tools/everyday',
  },
];

export default categories;

export function getCategoryById(id) {
  return categories.find(c => c.id === id);
}

export function getCategoryBySlug(slug) {
  return categories.find(c => c.slug === slug);
}
