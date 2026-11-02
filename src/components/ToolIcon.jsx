import { memo } from 'react';
import {
  QrCode, Scan, Palette, Wifi, MessageCircle, Mail, MessageSquare, MapPin,
  CreditCard, FileText, Image, Crop, Layers, FileType, Grid, LayoutGrid,
  Scale, Camera, Stamp, Eraser, Droplets, EyeOff, RotateCw, Pipette,
  SunMedium, Sparkles, Smartphone, ShieldAlert, FolderArchive, Minimize2,
  Maximize2, Combine, Scissors, FileCode, Table, Lock, Unlock, Hash,
  Trash2, ArrowUpDown, Edit3, PenTool, Code, Contrast, Shield, FileOutput,
  Presentation, Video, Film, Repeat, Music, VolumeX, Volume2, PlusCircle,
  AudioWaveform, Radio, Briefcase, FileCheck, GraduationCap, Calculator,
  Award, Percent, Calendar, Clock, CalendarCheck, Users, Keyboard, Zap,
  PlaySquare, Share2, Link2, Smile, Quote, TrendingUp, Layout, ArrowDownAZ,
  Search, Replace, Speech, Mic, GitCompare, BookOpen, PenLine, Wand2,
  Braces, CheckCircle2, Code2, AlignLeft, Cpu, Binary, Globe, KeyRound,
  ShieldCheck, Fingerprint, Sun, ScanLine, Database, Eye, BookMarked,
  Network, Coins, Receipt, Tag, Activity, Ruler, CircleDollarSign,
  CalendarDays, Banknote, Wallet, Timer, Hourglass, Dices, Shuffle,
  CircleDot, FileEdit, Barcode, ScanBarcode, Gauge, FileSpreadsheet,
  UserSquare2, Pen, CheckSquare, CaseSensitive, ListFilter, XCircle,
  Space, ListOrdered, RotateCcw, FileDiff, FileCode2, TerminalSquare,
  ArrowRightLeft, Play, Bell, Bookmark, UserCheck, Images, Grid2X2
} from 'lucide-react';

// Exhaustive dictionary mapping all 167 tool IDs to their bespoke 3D icon specifications
export const TOOL_ICON_MAP = {
  // ===== QR CODE TOOLS (12) =====
  'text-to-qr': { icon: QrCode, badge: 'TXT', color: '#22C55E', accentIcon: TypeBadge, variant: 'qr' },
  'url-to-qr': { icon: QrCode, badge: 'URL', color: '#16A34A', accentIcon: Globe, variant: 'qr' },
  'wifi-qr': { icon: QrCode, badge: 'WIFI', color: '#4ADE80', accentIcon: Wifi, variant: 'wifi' },
  'whatsapp-qr': { icon: QrCode, badge: 'CHAT', color: '#25D366', accentIcon: MessageCircle, variant: 'chat' },
  'contact-qr': { icon: QrCode, badge: 'VCARD', color: '#10B981', accentIcon: UserCheck, variant: 'vcard' },
  'email-qr': { icon: QrCode, badge: 'MAIL', color: '#059669', accentIcon: Mail, variant: 'mail' },
  'sms-qr': { icon: QrCode, badge: 'SMS', color: '#14B8A6', accentIcon: MessageSquare, variant: 'sms' },
  'location-qr': { icon: QrCode, badge: 'GEO', color: '#0D9488', accentIcon: MapPin, variant: 'location' },
  'upi-qr': { icon: QrCode, badge: 'UPI', color: '#047857', accentIcon: CreditCard, variant: 'upi' },
  'pdf-link-qr': { icon: QrCode, badge: 'PDF', color: '#EF4444', accentIcon: FileText, variant: 'pdf' },
  'qr-scanner': { icon: Scan, badge: 'SCAN', color: '#6DFF9A', accentIcon: Camera, variant: 'scanner' },
  'custom-qr-designer': { icon: QrCode, badge: '3D', color: '#86EFAC', accentIcon: Palette, variant: 'custom' },

  // ===== IMAGE & PHOTO TOOLS (25) =====
  'image-resizer': { icon: Image, badge: 'RESIZE', color: '#3B82F6', accentIcon: Maximize2, variant: 'resize' },
  'image-compressor': { icon: Image, badge: 'COMPACT', color: '#2563EB', accentIcon: Minimize2, variant: 'compress' },
  'image-cropper': { icon: Crop, badge: 'CROP', color: '#60A5FA', accentIcon: Image, variant: 'crop' },
  'image-bg-remover': { icon: Layers, badge: 'CUTOUT', color: '#93C5FD', accentIcon: Sparkles, variant: 'checkerboard' },
  'jpg-to-png': { icon: FileType, badge: 'JPG→PNG', color: '#3B82F6', accentIcon: ArrowRightLeft, variant: 'convert' },
  'png-to-jpg': { icon: FileType, badge: 'PNG→JPG', color: '#2563EB', accentIcon: ArrowRightLeft, variant: 'convert' },
  'webp-to-jpg': { icon: FileType, badge: 'WEBP→JPG', color: '#1D4ED8', accentIcon: ArrowRightLeft, variant: 'convert' },
  'jpg-to-webp': { icon: FileType, badge: 'JPG→WEBP', color: '#60A5FA', accentIcon: ArrowRightLeft, variant: 'convert' },
  'image-to-pdf': { icon: Image, badge: 'IMG→PDF', color: '#EF4444', accentIcon: FileText, variant: 'convert' },
  'image-overlay': { icon: Layers, badge: 'OVERLAY', color: '#0284C7', accentIcon: Image, variant: 'overlay' },
  'multiple-images-combine': { icon: Grid, badge: 'MERGE', color: '#0369A1', accentIcon: PlusCircle, variant: 'combine' },
  'image-collage': { icon: LayoutGrid, badge: 'COLLAGE', color: '#38BDF8', accentIcon: Image, variant: 'collage' },
  'photo-size-reducer': { icon: Scale, badge: 'EXACT KB', color: '#0EA5E9', accentIcon: Image, variant: 'scale' },
  'passport-photo': { icon: UserSquare2, badge: 'PASSPORT', color: '#0284C7', accentIcon: Camera, variant: 'passport' },
  'photo-watermark': { icon: Stamp, badge: 'STAMP', color: '#0284C7', accentIcon: Image, variant: 'stamp' },
  'image-watermark-remover': { icon: Eraser, badge: 'REMOVE', color: '#38BDF8', accentIcon: Image, variant: 'eraser' },
  'image-blur': { icon: Droplets, badge: 'BLUR', color: '#7DD3FC', accentIcon: EyeOff, variant: 'blur' },
  'image-pixelator': { icon: Grid2X2, badge: 'PIXEL', color: '#BAE6FD', accentIcon: Image, variant: 'pixel' },
  'image-rotator': { icon: RotateCw, badge: 'FLIP', color: '#60A5FA', accentIcon: Image, variant: 'rotate' },
  'image-color-picker': { icon: Pipette, badge: 'HEX', color: '#EC4899', accentIcon: Palette, variant: 'picker' },
  'photo-brightness-contrast': { icon: SunMedium, badge: 'CONTRAST', color: '#F59E0B', accentIcon: Contrast, variant: 'adjust' },
  'image-upscaler': { icon: Sparkles, badge: 'AI 4X', color: '#8B5CF6', accentIcon: Maximize2, variant: 'upscale' },
  'heic-to-jpg': { icon: Smartphone, badge: 'HEIC→JPG', color: '#6366F1', accentIcon: FileType, variant: 'convert' },
  'image-metadata-remover': { icon: ShieldAlert, badge: 'STRIP EXIF', color: '#EF4444', accentIcon: FileCode, variant: 'clean' },
  'bulk-image-resizer': { icon: FolderArchive, badge: 'BATCH', color: '#1D4ED8', accentIcon: Images, variant: 'batch' },

  // ===== PDF & DOCUMENT TOOLS (25) =====
  'pdf-compressor': { icon: FileText, badge: 'COMPRESS', color: '#EF4444', accentIcon: Minimize2, variant: 'compress' },
  'pdf-merger': { icon: Combine, badge: 'MERGE', color: '#DC2626', accentIcon: FileText, variant: 'merge' },
  'pdf-splitter': { icon: Scissors, badge: 'SPLIT', color: '#B91C1C', accentIcon: FileText, variant: 'split' },
  'pdf-to-word': { icon: FileText, badge: 'PDF→DOCX', color: '#2563EB', accentIcon: FileCode, variant: 'convert' },
  'word-to-pdf': { icon: FileCode, badge: 'DOCX→PDF', color: '#EF4444', accentIcon: FileText, variant: 'convert' },
  'pdf-to-jpg': { icon: FileText, badge: 'PDF→JPG', color: '#F97316', accentIcon: Image, variant: 'convert' },
  'jpg-to-pdf': { icon: Image, badge: 'JPG→PDF', color: '#DC2626', accentIcon: FileText, variant: 'convert' },
  'pdf-to-excel': { icon: FileText, badge: 'PDF→XLSX', color: '#10B981', accentIcon: Table, variant: 'convert' },
  'excel-to-pdf': { icon: Table, badge: 'XLSX→PDF', color: '#EF4444', accentIcon: FileText, variant: 'convert' },
  'pdf-page-rotator': { icon: RotateCw, badge: 'ROTATE', color: '#EA580C', accentIcon: FileText, variant: 'rotate' },
  'pdf-password-protector': { icon: Lock, badge: 'PROTECT', color: '#7C3AED', accentIcon: FileText, variant: 'lock' },
  'pdf-unlocker': { icon: Unlock, badge: 'UNLOCK', color: '#10B981', accentIcon: FileText, variant: 'unlock' },
  'pdf-watermark': { icon: Stamp, badge: 'WATERMARK', color: '#F43F5E', accentIcon: FileText, variant: 'stamp' },
  'pdf-page-number': { icon: Hash, badge: 'PAGE 1..N', color: '#06B6D4', accentIcon: FileText, variant: 'pages' },
  'pdf-page-remover': { icon: Trash2, badge: 'REMOVE', color: '#E11D48', accentIcon: FileText, variant: 'delete' },
  'pdf-reorder': { icon: ArrowUpDown, badge: 'REORDER', color: '#8B5CF6', accentIcon: FileText, variant: 'reorder' },
  'pdf-editor': { icon: Edit3, badge: 'ANNOTATE', color: '#F59E0B', accentIcon: FileText, variant: 'edit' },
  'pdf-to-text': { icon: FileText, badge: 'PDF→TXT', color: '#14B8A6', accentIcon: FileCode, variant: 'convert' },
  'pdf-signature': { icon: PenTool, badge: 'E-SIGN', color: '#4F46E5', accentIcon: FileText, variant: 'sign' },
  'html-to-pdf': { icon: Code, badge: 'HTML→PDF', color: '#EF4444', accentIcon: FileText, variant: 'convert' },
  'pdf-cropper': { icon: Crop, badge: 'CROP', color: '#F97316', accentIcon: FileText, variant: 'crop' },
  'pdf-grayscale': { icon: Contrast, badge: 'MONOCHROME', color: '#6B7280', accentIcon: FileText, variant: 'bw' },
  'pdf-metadata-remover': { icon: Shield, badge: 'ANONYMIZE', color: '#059669', accentIcon: FileText, variant: 'clean' },
  'pdf-page-extractor': { icon: FileOutput, badge: 'EXTRACT', color: '#D97706', accentIcon: FileText, variant: 'extract' },
  'pdf-to-pptx': { icon: Presentation, badge: 'PDF→PPTX', color: '#EA580C', accentIcon: FileText, variant: 'convert' },

  // ===== VIDEO & AUDIO TOOLS (20) =====
  'video-compressor': { icon: Video, badge: 'COMPACT', color: '#8B5CF6', accentIcon: Minimize2, variant: 'compress' },
  'video-trimmer': { icon: Scissors, badge: 'TRIM CUT', color: '#7C3AED', accentIcon: Video, variant: 'trim' },
  'video-merger': { icon: Combine, badge: 'JOIN CLIPS', color: '#6D28D9', accentIcon: Video, variant: 'merge' },
  'video-resizer': { icon: Video, badge: 'SCALE', color: '#A78BFA', accentIcon: Maximize2, variant: 'resize' },
  'video-cropper': { icon: Crop, badge: 'CROP', color: '#8B5CF6', accentIcon: Video, variant: 'crop' },
  'video-converter': { icon: Repeat, badge: 'MP4↔WEBM', color: '#9333EA', accentIcon: Video, variant: 'convert' },
  'mp4-to-mp3': { icon: Video, badge: 'MP4→MP3', color: '#C084FC', accentIcon: Music, variant: 'convert' },
  'video-to-gif': { icon: Video, badge: 'VID→GIF', color: '#E879F9', accentIcon: Sparkles, variant: 'convert' },
  'gif-to-mp4': { icon: Sparkles, badge: 'GIF→MP4', color: '#D946EF', accentIcon: Video, variant: 'convert' },
  'video-speed-changer': { icon: Gauge, badge: '0.5x-2x', color: '#F59E0B', accentIcon: Video, variant: 'speed' },
  'video-rotator': { icon: RotateCw, badge: '90°/180°', color: '#8B5CF6', accentIcon: Video, variant: 'rotate' },
  'video-mute': { icon: VolumeX, badge: 'STRIP AUDIO', color: '#EF4444', accentIcon: Video, variant: 'mute' },
  'add-audio-to-video': { icon: PlusCircle, badge: 'ADD BGM', color: '#10B981', accentIcon: Music, variant: 'add' },
  'video-overlay': { icon: Layers, badge: 'WATERMARK', color: '#6366F1', accentIcon: Video, variant: 'overlay' },
  'video-thumbnail': { icon: Camera, badge: 'POSTER', color: '#EC4899', accentIcon: Video, variant: 'thumb' },
  'audio-compressor': { icon: Music, badge: 'KB REDUCE', color: '#A855F7', accentIcon: Minimize2, variant: 'compress' },
  'audio-trimmer': { icon: Scissors, badge: 'AUDIO CUT', color: '#9333EA', accentIcon: Music, variant: 'trim' },
  'audio-merger': { icon: AudioWaveform, badge: 'COMBINE', color: '#7C3AED', accentIcon: Combine, variant: 'merge' },
  'mp3-to-wav': { icon: Music, badge: 'MP3→WAV', color: '#6366F1', accentIcon: Radio, variant: 'convert' },
  'audio-volume-booster': { icon: Volume2, badge: 'BOOST 200%', color: '#22C55E', accentIcon: Zap, variant: 'boost' },

  // ===== STUDENT & JOB TOOLS (15) =====
  'resume-builder': { icon: Briefcase, badge: 'RESUME', color: '#F59E0B', accentIcon: FileSpreadsheet, variant: 'resume' },
  'ats-resume-checker': { icon: FileCheck, badge: 'ATS PASS', color: '#10B981', accentIcon: Search, variant: 'check' },
  'passport-photo-app': { icon: UserSquare2, badge: 'JOB PHOTO', color: '#D97706', accentIcon: Camera, variant: 'passport' },
  'signature-reducer': { icon: Pen, badge: 'SIGN 20KB', color: '#B45309', accentIcon: Minimize2, variant: 'sign' },
  'cgpa-calculator': { icon: GraduationCap, badge: 'CGPA 10.0', color: '#F59E0B', accentIcon: Calculator, variant: 'gpa' },
  'sgpa-calculator': { icon: Award, badge: 'SGPA SEM', color: '#D97706', accentIcon: Calculator, variant: 'gpa' },
  'percentage-calculator': { icon: Percent, badge: '% FINDER', color: '#EAB308', accentIcon: Calculator, variant: 'calc' },
  'marks-percentage': { icon: CheckSquare, badge: 'TOTAL %', color: '#CA8A04', accentIcon: Percent, variant: 'calc' },
  'age-calculator': { icon: Calendar, badge: 'DOB AGE', color: '#F59E0B', accentIcon: Clock, variant: 'age' },
  'attendance-calculator': { icon: CalendarCheck, badge: '75% GOAL', color: '#10B981', accentIcon: Users, variant: 'attend' },
  'typing-speed-test': { icon: Keyboard, badge: 'WPM PRO', color: '#6366F1', accentIcon: Zap, variant: 'typing' },
  'word-counter-student': { icon: FileText, badge: 'ESSAY WORDS', color: '#0EA5E9', accentIcon: Hash, variant: 'counter' },
  'character-counter-student': { icon: CaseSensitive, badge: 'CHARS LIMIT', color: '#06B6D4', accentIcon: Hash, variant: 'counter' },
  'text-to-pdf': { icon: FileText, badge: 'TXT→PDF', color: '#EF4444', accentIcon: FileCode, variant: 'convert' },
  'certificate-maker': { icon: Award, badge: 'DIPLOMA', color: '#F59E0B', accentIcon: Sparkles, variant: 'certificate' },

  // ===== SOCIAL MEDIA & CREATOR TOOLS (15) =====
  'instagram-resizer': { icon: Camera, badge: '1:1 / 4:5', color: '#EC4899', accentIcon: Maximize2, variant: 'social' },
  'instagram-reel-cover': { icon: Smartphone, badge: '9:16 COVER', color: '#DB2777', accentIcon: Image, variant: 'reel' },
  'youtube-thumbnail-resizer': { icon: PlaySquare, badge: '1280x720', color: '#EF4444', accentIcon: Maximize2, variant: 'thumb' },
  'youtube-thumbnail-maker': { icon: Sparkles, badge: 'YT CANVAS', color: '#DC2626', accentIcon: PlaySquare, variant: 'maker' },
  'social-collage': { icon: LayoutGrid, badge: 'COLLAGE', color: '#F43F5E', accentIcon: Share2, variant: 'collage' },
  'qr-generator-social': { icon: QrCode, badge: 'BIO LINK', color: '#10B981', accentIcon: Share2, variant: 'qr' },
  'link-shortener': { icon: Link2, badge: 'SHORT URL', color: '#8B5CF6', accentIcon: Scissors, variant: 'link' },
  'text-overlay-image': { icon: Layout, badge: 'CAPTION', color: '#F472B6', accentIcon: Image, variant: 'overlay' },
  'meme-generator': { icon: Smile, badge: 'TOP/BOTTOM', color: '#F59E0B', accentIcon: Image, variant: 'meme' },
  'caption-generator': { icon: Quote, badge: 'ENGAGE', color: '#A855F7', accentIcon: Sparkles, variant: 'quote' },
  'hashtag-generator': { icon: Hash, badge: '#VIRAL', color: '#06B6D4', accentIcon: TrendingUp, variant: 'tags' },
  'quote-poster': { icon: Quote, badge: '800x800', color: '#E11D48', accentIcon: Layout, variant: 'poster' },
  'gif-maker': { icon: Film, badge: 'FRAME ANIM', color: '#D946EF', accentIcon: Sparkles, variant: 'gif' },
  'profile-picture-cropper': { icon: UserSquare2, badge: 'CIRCULAR', color: '#3B82F6', accentIcon: Crop, variant: 'avatar' },
  'social-image-converter': { icon: Share2, badge: 'MULTI-PLAT', color: '#EC4899', accentIcon: Repeat, variant: 'convert' },

  // ===== TEXT & WRITING TOOLS (15) =====
  'word-counter': { icon: FileText, badge: 'WORDS', color: '#06B6D4', accentIcon: Hash, variant: 'counter' },
  'character-counter': { icon: CaseSensitive, badge: 'CHARS', color: '#0891B2', accentIcon: Hash, variant: 'counter' },
  'case-converter': { icon: CaseSensitive, badge: 'aA→AA', color: '#0E7490', accentIcon: ArrowUpDown, variant: 'case' },
  'remove-duplicate-lines': { icon: ListFilter, badge: 'UNIQUE', color: '#06B6D4', accentIcon: XCircle, variant: 'clean' },
  'remove-extra-spaces': { icon: Space, badge: 'COLLAPSE', color: '#0284C7', accentIcon: Eraser, variant: 'clean' },
  'text-sorter': { icon: ArrowDownAZ, badge: 'SORT A-Z', color: '#3B82F6', accentIcon: ListOrdered, variant: 'sort' },
  'text-reverser': { icon: RotateCcw, badge: 'REVERSE', color: '#6366F1', accentIcon: AlignLeft, variant: 'reverse' },
  'find-replace': { icon: Search, badge: 'REPLACE', color: '#8B5CF6', accentIcon: Replace, variant: 'replace' },
  'text-to-speech': { icon: Volume2, badge: 'LISTEN TTS', color: '#10B981', accentIcon: Speech, variant: 'speak' },
  'speech-to-text': { icon: Mic, badge: 'VOICE DICT', color: '#22C55E', accentIcon: FileText, variant: 'mic' },
  'text-diff': { icon: GitCompare, badge: 'DIFF VIEW', color: '#F59E0B', accentIcon: FileDiff, variant: 'diff' },
  'lorem-ipsum': { icon: BookOpen, badge: 'GENERATOR', color: '#64748B', accentIcon: Sparkles, variant: 'dummy' },
  'text-to-handwriting': { icon: PenLine, badge: 'REALISTIC', color: '#4F46E5', accentIcon: FileText, variant: 'handwriting' },
  'fancy-text': { icon: Wand2, badge: 'UNICODE', color: '#D946EF', accentIcon: Sparkles, variant: 'fancy' },
  'markdown-to-html': { icon: Code, badge: 'MD→HTML', color: '#EA580C', accentIcon: FileCode, variant: 'convert' },

  // ===== DEVELOPER TOOLS (20) =====
  'json-formatter': { icon: Braces, badge: 'BEAUTIFY', color: '#10B981', accentIcon: Code, variant: 'json' },
  'json-validator': { icon: CheckCircle2, badge: 'VALIDATE', color: '#059669', accentIcon: Braces, variant: 'check' },
  'html-formatter': { icon: Code2, badge: 'INDENT', color: '#F97316', accentIcon: AlignLeft, variant: 'code' },
  'css-minifier': { icon: FileCode2, badge: 'CSS MIN', color: '#3B82F6', accentIcon: Minimize2, variant: 'minify' },
  'js-minifier': { icon: Cpu, badge: 'JS MIN', color: '#F59E0B', accentIcon: Minimize2, variant: 'minify' },
  'base64-encoder': { icon: Binary, badge: 'BASE64', color: '#8B5CF6', accentIcon: ArrowRightLeft, variant: 'encode' },
  'url-encoder': { icon: Globe, badge: 'URI ENCODE', color: '#06B6D4', accentIcon: Code, variant: 'encode' },
  'jwt-decoder': { icon: KeyRound, badge: 'JWT CLAIM', color: '#EC4899', accentIcon: ShieldCheck, variant: 'jwt' },
  'regex-tester': { icon: TerminalSquare, badge: 'REGEX', color: '#6366F1', accentIcon: Search, variant: 'regex' },
  'uuid-generator': { icon: Fingerprint, badge: 'GUID / UUID', color: '#10B981', accentIcon: Sparkles, variant: 'uuid' },
  'hash-generator': { icon: Hash, badge: 'SHA256/MD5', color: '#64748B', accentIcon: Lock, variant: 'hash' },
  'password-generator': { icon: Shield, badge: 'SECURITY', color: '#22C55E', accentIcon: KeyRound, variant: 'password' },
  'html-color-picker': { icon: Palette, badge: 'HEX / RGB', color: '#E11D48', accentIcon: Pipette, variant: 'picker' },
  'css-gradient-generator': { icon: Sun, badge: 'CSS STYLES', color: '#F59E0B', accentIcon: Palette, variant: 'gradient' },
  'qr-reader-dev': { icon: ScanLine, badge: 'PAYLOAD', color: '#10B981', accentIcon: QrCode, variant: 'scanner' },
  'timestamp-converter': { icon: Clock, badge: 'EPOCH MS', color: '#0284C7', accentIcon: Calendar, variant: 'time' },
  'sql-formatter': { icon: Database, badge: 'SQL QUERY', color: '#0284C7', accentIcon: AlignLeft, variant: 'sql' },
  'html-preview': { icon: Eye, badge: 'SANDBOX', color: '#2563EB', accentIcon: Code2, variant: 'preview' },
  'markdown-preview': { icon: BookMarked, badge: 'GFM LIVE', color: '#475569', accentIcon: Eye, variant: 'preview' },
  'api-response-formatter': { icon: Network, badge: 'ENDPOINT', color: '#10B981', accentIcon: Braces, variant: 'api' },

  // ===== CALCULATORS & CONVERTERS (10) =====
  'emi-calculator': { icon: Coins, badge: 'LOAN EMI', color: '#6366F1', accentIcon: Calculator, variant: 'finance' },
  'sip-calculator': { icon: TrendingUp, badge: 'SIP COMPOUND', color: '#4F46E5', accentIcon: Calculator, variant: 'finance' },
  'gst-calculator': { icon: Receipt, badge: 'IN/EX TAX', color: '#4338CA', accentIcon: Percent, variant: 'tax' },
  'discount-calculator': { icon: Tag, badge: '% DISCOUNT', color: '#EC4899', accentIcon: Percent, variant: 'discount' },
  'bmi-calculator': { icon: Activity, badge: 'BMI INDEX', color: '#10B981', accentIcon: Scale, variant: 'health' },
  'unit-converter': { icon: Ruler, badge: 'ALL UNITS', color: '#6366F1', accentIcon: ArrowRightLeft, variant: 'unit' },
  'currency-converter': { icon: CircleDollarSign, badge: 'EXCHANGE', color: '#059669', accentIcon: ArrowRightLeft, variant: 'currency' },
  'date-difference': { icon: CalendarDays, badge: 'DELTA TIME', color: '#F59E0B', accentIcon: Clock, variant: 'date' },
  'loan-interest': { icon: Banknote, badge: 'SIMPLE/CMP', color: '#3B82F6', accentIcon: Percent, variant: 'loan' },
  'salary-calculator': { icon: Wallet, badge: 'CTC IN-HAND', color: '#10B981', accentIcon: Calculator, variant: 'salary' },

  // ===== EVERYDAY TOOLS (10) =====
  'stopwatch': { icon: Timer, badge: 'LAPS / MS', color: '#F97316', accentIcon: Play, variant: 'timer' },
  'countdown-timer': { icon: Hourglass, badge: 'COUNTDOWN', color: '#EA580C', accentIcon: Bell, variant: 'alarm' },
  'random-number': { icon: Dices, badge: 'CRYPTO RNG', color: '#D97706', accentIcon: Hash, variant: 'rng' },
  'random-name-picker': { icon: Users, badge: 'SHUFFLER', color: '#B45309', accentIcon: Shuffle, variant: 'picker' },
  'dice-roller': { icon: Dices, badge: 'D4 - D20', color: '#F59E0B', accentIcon: Sparkles, variant: 'dice' },
  'flip-coin': { icon: CircleDot, badge: 'PROBABILITY', color: '#EAB308', accentIcon: RotateCw, variant: 'coin' },
  'online-notepad': { icon: FileEdit, badge: 'AUTOSAVE', color: '#0284C7', accentIcon: Bookmark, variant: 'note' },
  'barcode-generator': { icon: Barcode, badge: '1D CODE', color: '#10B981', accentIcon: Sparkles, variant: 'barcode' },
  'barcode-scanner': { icon: ScanBarcode, badge: 'CAM / FILE', color: '#059669', accentIcon: Camera, variant: 'scanner' },
  'speed-test': { icon: Gauge, badge: 'LATENCY', color: '#EF4444', accentIcon: Zap, variant: 'speed' }
};

// Fallback mini badge icon
function TypeBadge(props) {
  return <AlignLeft {...props} />;
}

// Category fallback configurations
const CATEGORY_FALLBACKS = {
  qr: { icon: QrCode, color: '#22C55E', badge: 'QR' },
  images: { icon: Image, color: '#3B82F6', badge: 'IMG' },
  pdf: { icon: FileText, color: '#EF4444', badge: 'PDF' },
  'video-audio': { icon: Video, color: '#8B5CF6', badge: 'MEDIA' },
  'student-job': { icon: GraduationCap, color: '#F59E0B', badge: 'CAREER' },
  'social-media': { icon: Share2, color: '#EC4899', badge: 'CREATOR' },
  text: { icon: FileText, color: '#06B6D4', badge: 'TEXT' },
  developer: { icon: Code2, color: '#10B981', badge: 'DEV' },
  calculators: { icon: Calculator, color: '#6366F1', badge: 'CALC' },
  everyday: { icon: Sparkles, color: '#F97316', badge: 'UTILITY' },
};

export const ToolIcon = memo(function ToolIcon({
  toolId,
  category = 'everyday',
  size = 'md',
  showBadge = true,
  className = '',
  style = {}
}) {
  const config = TOOL_ICON_MAP[toolId] || CATEGORY_FALLBACKS[category] || {
    icon: Sparkles,
    color: '#22C55E',
    badge: 'TOOL',
  };

  const PrimaryIcon = config.icon || Sparkles;
  const AccentIcon = config.accentIcon;
  const color = config.color || '#22C55E';
  const badge = config.badge || '';
  const variant = config.variant || 'default';

  // Size specifications
  const sizeMap = {
    sm: { container: 40, icon: 18, badgeFontSize: '0.55rem', pad: 4, corner: 12 },
    md: { container: 58, icon: 26, badgeFontSize: '0.625rem', pad: 8, corner: 18 },
    lg: { container: 74, icon: 34, badgeFontSize: '0.7rem', pad: 12, corner: 22 },
    xl: { container: 92, icon: 42, badgeFontSize: '0.75rem', pad: 16, corner: 26 },
  };

  const spec = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`tool-icon-3d tool-icon-${size} ${className}`}
      style={{
        width: spec.container,
        height: spec.container,
        minWidth: spec.container,
        minHeight: spec.container,
        borderRadius: spec.corner,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${color}22 0%, rgba(11, 23, 16, 0.95) 70%, ${color}15 100%)`,
        border: `1.5px solid ${color}45`,
        boxShadow: `0 8px 24px -4px ${color}35, inset 0 1px 2px rgba(255, 255, 255, 0.3), inset 0 -2px 6px rgba(0, 0, 0, 0.5)`,
        color: color,
        transformStyle: 'preserve-3d',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...style,
      }}
    >
      {/* 3D Glass Highlight Edge */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, transparent 60%)',
          pointerEvents: 'none',
        }}
      />

      {/* Decorative Variant Background Accent */}
      {variant === 'checkerboard' && (
        <div
          style={{
            position: 'absolute',
            inset: 6,
            borderRadius: spec.corner - 4,
            backgroundImage: `linear-gradient(45deg, ${color}15 25%, transparent 25%), linear-gradient(-45deg, ${color}15 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${color}15 75%), linear-gradient(-45deg, transparent 75%, ${color}15 75%)`,
            backgroundSize: '8px 8px',
            backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
      )}

      {variant === 'scanner' && (
        <div
          style={{
            position: 'absolute',
            width: '80%',
            height: '2px',
            background: `linear-gradient(90deg, transparent, #6DFF9A, transparent)`,
            boxShadow: `0 0 8px #6DFF9A`,
            animation: 'scanLineFloat 2.2s ease-in-out infinite alternate',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Primary 3D Icon */}
      <div
        className="tool-icon-primary-symbol"
        style={{
          position: 'relative',
          zIndex: 2,
          filter: `drop-shadow(0 4px 10px ${color}55)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.3s ease',
        }}
      >
        <PrimaryIcon size={spec.icon} strokeWidth={2.2} />
      </div>

      {/* Secondary Accent Icon Badge (if defined and size >= md) */}
      {AccentIcon && size !== 'sm' && (
        <div
          className="tool-icon-accent-badge"
          style={{
            position: 'absolute',
            bottom: -3,
            right: -3,
            width: spec.container * 0.42,
            height: spec.container * 0.42,
            borderRadius: '50%',
            background: 'rgba(5, 11, 8, 0.95)',
            border: `1.5px solid ${color}`,
            boxShadow: `0 2px 8px rgba(0, 0, 0, 0.6), 0 0 10px ${color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            zIndex: 3,
            transition: 'transform 0.25s ease',
          }}
        >
          <AccentIcon size={Math.round(spec.icon * 0.52)} strokeWidth={2.5} />
        </div>
      )}

      {/* Micro Format Pill (when showBadge is true and size >= md) */}
      {showBadge && badge && size === 'xl' && (
        <span
          style={{
            position: 'absolute',
            top: -6,
            right: -4,
            fontSize: '0.625rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '2px 7px',
            borderRadius: '9999px',
            background: color,
            color: '#FFFFFF',
            boxShadow: `0 2px 8px ${color}66`,
            zIndex: 4,
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
});

export default ToolIcon;
