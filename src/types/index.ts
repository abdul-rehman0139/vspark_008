/**
 * VSpark & Poster Studio Types
 */

export type PageView = 
  | 'home' 
  | 'competitions' 
  | 'events' 
  | 'poster-studio' 
  | 'poster-editor' 
  | 'poster-dashboard' 
  | 'poster-admin'
  | 'pdf-editor';

export interface CanvasDimension {
  id: string;
  name: string;
  category: 'Print' | 'Social' | 'Display' | 'Custom';
  width: number; // in pixels
  height: number; // in pixels
  unitDesc: string;
  isPopular?: boolean;
}

export const PRESET_DIMENSIONS: CanvasDimension[] = [
  { id: 'a4-portrait', name: 'A4 Portrait', category: 'Print', width: 794, height: 1123, unitDesc: '210 × 297 mm', isPopular: true },
  { id: 'a4-landscape', name: 'A4 Landscape', category: 'Print', width: 1123, height: 794, unitDesc: '297 × 210 mm' },
  { id: 'a3-portrait', name: 'A3 Poster', category: 'Print', width: 842, height: 1191, unitDesc: '297 × 420 mm', isPopular: true },
  { id: 'instagram-post', name: 'Instagram Square', category: 'Social', width: 1080, height: 1080, unitDesc: '1080 × 1080 px', isPopular: true },
  { id: 'instagram-story', name: 'Instagram Story / Reel', category: 'Social', width: 1080, height: 1920, unitDesc: '1080 × 1920 px', isPopular: true },
  { id: 'youtube-thumb', name: 'YouTube Thumbnail', category: 'Display', width: 1280, height: 720, unitDesc: '16:9 · 1280 × 720 px' },
  { id: 'event-banner', name: 'Event Banner', category: 'Display', width: 1200, height: 630, unitDesc: '1200 × 630 px' },
];

export type TemplateCategory =
  | 'All'
  | 'Educational'
  | 'University Event'
  | 'Technology'
  | 'Hackathon'
  | 'Competition'
  | 'Business'
  | 'Marketing'
  | 'Social Media'
  | 'Workshop'
  | 'Seminar'
  | 'Sports'
  | 'Creative & Minimal';

export interface PosterTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  thumbnailUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  dimensionName: string;
  description: string;
  tags: string[];
  isFeatured?: boolean;
  isActive: boolean;
  designJson: any; // Fabric.js JSON export
  createdAt: string;
}

export interface PosterDesign {
  id: string;
  userId: string;
  title: string;
  thumbnailUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  dimensionName: string;
  designJson: any;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatar?: string;
  role: 'student' | 'organizer' | 'admin';
  institution?: string;
}

export interface PdfDocumentRecord {
  id: string;
  userId: string;
  title: string;
  pageCount: number;
  fileSize?: number;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Competition {
  id: string;
  title: string;
  organizer: string;
  category: 'Hackathon' | 'AI / Tech' | 'Business' | 'Design' | 'Robotics';
  prizePool: string;
  deadline: string;
  daysLeft: number;
  participants: number;
  image: string;
  tags: string[];
  description: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  type: 'Workshop' | 'Seminar' | 'Cultural Fest' | 'Keynote' | 'Exhibition';
  date: string;
  time: string;
  location: string;
  speakerOrHost: string;
  attendeesCount: number;
  image: string;
  tags: string[];
  description: string;
}

export interface UploadedAsset {
  id: string;
  name: string;
  dataUrl: string;
  type: string;
  size: number;
  createdAt: string;
}
