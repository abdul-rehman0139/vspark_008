import { PosterDesign, PosterTemplate, UploadedAsset, UserProfile } from '../types';
import { INITIAL_TEMPLATES, CURRENT_USER, ADMIN_USER } from '../data/sampleData';
import { resolveImageUrl } from '../assets/imageAssets';

const STORAGE_KEYS = {
  DESIGNS: 'vspark_poster_designs_v1',
  TEMPLATES: 'vspark_poster_templates_v1',
  FAVORITES: 'vspark_poster_favorites_v1',
  UPLOADS: 'vspark_poster_uploads_v1',
  USER: 'vspark_current_user_v1',
  STATS: 'vspark_poster_stats_v1',
};

export interface StudioStats {
  totalDesignsCreated: number;
  totalExports: number;
  templatesUsedCount: Record<string, number>;
}

export function sanitizeDesignJson(designJson: any): any {
  if (!designJson) return designJson;
  try {
    const parsed = typeof designJson === 'string' ? JSON.parse(designJson) : { ...designJson };
    if (parsed && Array.isArray(parsed.objects)) {
      parsed.objects = parsed.objects.map((obj: any) => {
        if (obj && (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text')) {
          if (!obj.styles || typeof obj.styles !== 'object') {
            obj.styles = {};
          }
        }
        return obj;
      });
    }
    return parsed;
  } catch (e) {
    return designJson;
  }
}

export const StorageService = {
  // User Authentication & Session
  getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to read user from localStorage', e);
    }
    return CURRENT_USER;
  },

  setUser(user: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user', e);
    }
  },

  switchRole(role: 'student' | 'admin') {
    const user = role === 'admin' ? ADMIN_USER : CURRENT_USER;
    this.setUser(user);
    return user;
  },

  // Templates
  getTemplates(): PosterTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (data) {
        const stored = JSON.parse(data);
        if (Array.isArray(stored) && stored.length > 0) {
          return stored.map((tpl: PosterTemplate) => ({
            ...tpl,
            thumbnailUrl: resolveImageUrl(tpl.thumbnailUrl),
            designJson: sanitizeDesignJson(tpl.designJson)
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to load templates from storage', e);
    }
    // Default to INITIAL_TEMPLATES
    const sanitizedInitials = INITIAL_TEMPLATES.map((tpl) => ({
      ...tpl,
      thumbnailUrl: resolveImageUrl(tpl.thumbnailUrl),
      designJson: sanitizeDesignJson(tpl.designJson)
    }));
    this.saveTemplates(sanitizedInitials);
    return sanitizedInitials;
  },

  saveTemplates(templates: PosterTemplate[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    } catch (e) {
      console.warn('Failed to save templates', e);
    }
  },

  addTemplate(template: PosterTemplate) {
    const list = this.getTemplates();
    const updated = [template, ...list.filter(t => t.id !== template.id)];
    this.saveTemplates(updated);
    return updated;
  },

  updateTemplate(updatedTemplate: PosterTemplate) {
    const list = this.getTemplates();
    const updated = list.map(t => t.id === updatedTemplate.id ? updatedTemplate : t);
    this.saveTemplates(updated);
    return updated;
  },

  deleteTemplate(id: string) {
    const list = this.getTemplates();
    const updated = list.filter(t => t.id !== id);
    this.saveTemplates(updated);
    return updated;
  },

  // User Designs
  getDesigns(userId?: string): PosterDesign[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DESIGNS);
      if (data) {
        const parsed: PosterDesign[] = JSON.parse(data);
        const sanitized = parsed.map(d => ({
          ...d,
          thumbnailUrl: resolveImageUrl(d.thumbnailUrl),
          designJson: sanitizeDesignJson(d.designJson)
        }));
        if (userId) {
          return sanitized.filter(d => d.userId === userId);
        }
        return sanitized;
      }
    } catch (e) {
      console.warn('Failed to read designs', e);
    }
    return [];
  },

  saveDesign(design: PosterDesign): PosterDesign {
    const designs = this.getDesigns();
    const existingIndex = designs.findIndex(d => d.id === design.id);
    const updatedDesign = {
      ...design,
      updatedAt: new Date().toISOString()
    };

    let updatedList: PosterDesign[];
    if (existingIndex >= 0) {
      updatedList = [...designs];
      updatedList[existingIndex] = updatedDesign;
    } else {
      updatedList = [updatedDesign, ...designs];
      this.incrementStat('totalDesignsCreated');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(updatedList));
    } catch (e) {
      console.error('Storage quota exceeded or error saving design', e);
    }

    return updatedDesign;
  },

  getDesignById(id: string): PosterDesign | undefined {
    const designs = this.getDesigns();
    return designs.find(d => d.id === id);
  },

  deleteDesign(id: string): boolean {
    const designs = this.getDesigns();
    const filtered = designs.filter(d => d.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.DESIGNS, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.warn('Failed to delete design', e);
      return false;
    }
  },

  duplicateDesign(id: string): PosterDesign | null {
    const target = this.getDesignById(id);
    if (!target) return null;

    const copy: PosterDesign = {
      ...target,
      id: 'design_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.saveDesign(copy);
  },

  // Favorites
  getFavorites(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  toggleFavorite(templateId: string): boolean {
    const favs = this.getFavorites();
    let updated: string[];
    const isFav = favs.includes(templateId);
    if (isFav) {
      updated = favs.filter(id => id !== templateId);
    } else {
      updated = [...favs, templateId];
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    return !isFav;
  },

  // Uploaded Assets
  getUploads(): UploadedAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UPLOADS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveUpload(asset: UploadedAsset): UploadedAsset[] {
    const list = this.getUploads();
    // Keep max 20 uploads in local storage to prevent quota limits
    const updated = [asset, ...list.slice(0, 19)];
    try {
      localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save upload image to localStorage', e);
    }
    return updated;
  },

  deleteUpload(id: string): UploadedAsset[] {
    const list = this.getUploads();
    const updated = list.filter(u => u.id !== id);
    localStorage.setItem(STORAGE_KEYS.UPLOADS, JSON.stringify(updated));
    return updated;
  },

  // Statistics
  getStats(): StudioStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (data) return JSON.parse(data);
    } catch (e) {
      // fallback
    }
    return {
      totalDesignsCreated: 148,
      totalExports: 312,
      templatesUsedCount: {
        'tpl-hackathon': 84,
        'tpl-symposium': 42,
        'tpl-cultural-fest': 76,
        'tpl-startup-pitch': 58
      }
    };
  },

  incrementStat(key: 'totalDesignsCreated' | 'totalExports', templateId?: string) {
    const stats = this.getStats();
    stats[key] = (stats[key] || 0) + 1;
    if (templateId) {
      stats.templatesUsedCount[templateId] = (stats.templatesUsedCount[templateId] || 0) + 1;
    }
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {}
  }
};
