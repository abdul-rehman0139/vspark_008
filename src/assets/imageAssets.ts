/**
 * Centralized Image Assets
 * Uses Vite ES module imports so images are correctly bundled, hashed,
 * and served in both development, production builds, and public preview.
 */
import heroMockup from './images/poster_hero_mockup_1793771144906.jpg';
import hackathonThumb from './images/template_hackathon_thumb_1793771144968.jpg';
import symposiumThumb from './images/template_symposium_thumb_1793771146420.jpg';
import festThumb from './images/template_fest_thumb_1793771146032.jpg';
import minimalThumb from './images/template_minimal_thumb_1793804332129.jpg';
import sportsThumb from './images/template_sports_thumb_1793804332612.jpg';
import startupThumb from './images/template_startup_thumb_1793804333099.jpg';
import socialThumb from './images/template_social_thumb_1793804334736.jpg';

export const IMAGE_ASSETS = {
  heroMockup,
  hackathonThumb,
  symposiumThumb,
  festThumb,
  minimalThumb,
  sportsThumb,
  startupThumb,
  socialThumb,
  
  // Safe SVG avatar placeholders that never fail across sandboxes
  studentAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%236366f1"><circle cx="50" cy="50" r="50" fill="%234338ca"/><circle cx="50" cy="38" r="18" fill="%23e0e7ff"/><path d="M18 85 C22 64 36 58 50 58 C64 58 78 64 82 85 Z" fill="%23e0e7ff"/></svg>',
  adminAvatar: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="%23f59e0b"><circle cx="50" cy="50" r="50" fill="%23b45309"/><circle cx="50" cy="38" r="18" fill="%23fef3c7"/><path d="M18 85 C22 64 36 58 50 58 C64 58 78 64 82 85 Z" fill="%23fef3c7"/></svg>'
};

/**
 * Migration helper: If an old design or template in localStorage references
 * raw /src/assets/images/... URLs, map it to the bundled asset URL.
 */
export function resolveImageUrl(url: string | undefined): string {
  if (!url) return IMAGE_ASSETS.heroMockup;
  if (url.includes('poster_hero_mockup')) return IMAGE_ASSETS.heroMockup;
  if (url.includes('hackathon')) return IMAGE_ASSETS.hackathonThumb;
  if (url.includes('symposium')) return IMAGE_ASSETS.symposiumThumb;
  if (url.includes('fest')) return IMAGE_ASSETS.festThumb;
  if (url.includes('minimal')) return IMAGE_ASSETS.minimalThumb;
  if (url.includes('sports')) return IMAGE_ASSETS.sportsThumb;
  if (url.includes('startup')) return IMAGE_ASSETS.startupThumb;
  if (url.includes('social')) return IMAGE_ASSETS.socialThumb;
  return url;
}
