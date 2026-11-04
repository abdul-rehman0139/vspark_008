import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  Download, 
  Calendar, 
  Sparkles, 
  FolderHeart, 
  Heart,
  Layers,
  ArrowRight
} from 'lucide-react';
import { PosterDesign, PosterTemplate, UserProfile } from '../../../types';
import { StorageService } from '../../../services/storage';
import { resolveImageUrl, IMAGE_ASSETS } from '../../../assets/imageAssets';

interface PosterDashboardProps {
  user: UserProfile;
  designs: PosterDesign[];
  templates: PosterTemplate[];
  onOpenCreateModal: () => void;
  onEditDesign: (design: PosterDesign) => void;
  onSelectTemplate: (template: PosterTemplate) => void;
  onRefreshDesigns: () => void;
}

export const PosterDashboard: React.FC<PosterDashboardProps> = ({
  user,
  designs,
  templates,
  onOpenCreateModal,
  onEditDesign,
  onSelectTemplate,
  onRefreshDesigns
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'drafts' | 'favorites'>('all');
  const favorites = StorageService.getFavorites();

  const handleDuplicate = (id: string) => {
    StorageService.duplicateDesign(id);
    onRefreshDesigns();
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      StorageService.deleteDesign(id);
      onRefreshDesigns();
    }
  };

  const handleDownload = (design: PosterDesign) => {
    if (design.thumbnailUrl) {
      const link = document.createElement('a');
      link.download = `${design.title.toLowerCase().replace(/\s+/g, '_')}.jpg`;
      link.href = design.thumbnailUrl;
      link.click();
    }
  };

  const favoriteTemplates = templates.filter(t => favorites.includes(t.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <FolderHeart className="w-3.5 h-3.5" />
              <span>Poster Studio Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {user.institution} · Manage your campus competition posters, conference flyers, and templates.
            </p>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Poster</span>
          </button>
        </div>

        {/* Dashboard Tabs & Metrics */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              My Posters ({designs.length})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'drafts'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Drafts ({designs.filter(d => d.status === 'draft').length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Favorite Templates ({favoriteTemplates.length})
            </button>
          </div>

          <span className="hidden sm:inline text-xs text-slate-500">
            Total Designs: <strong className="text-slate-300 font-mono">{designs.length}</strong>
          </span>
        </div>

        {/* TAB: FAVORITES */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteTemplates.length === 0 ? (
              <div className="py-16 text-center border border-slate-900 rounded-2xl bg-slate-900/30 p-8">
                <Heart className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-300">No favorite templates yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse the template library and click the heart icon on any poster layout to save it here for quick access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteTemplates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 hover:border-indigo-500 transition-all cursor-pointer"
                  >
                    <div className="aspect-[3/4] w-full bg-slate-950 overflow-hidden relative">
                      <img
                        src={resolveImageUrl(template.thumbnailUrl)}
                        alt={template.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = IMAGE_ASSETS.heroMockup;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-sm font-bold text-white truncate">{template.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{template.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: MY POSTERS (ALL / DRAFTS) */}
        {activeTab !== 'favorites' && (
          <div>
            {designs.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20 p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-indigo-950/80 text-indigo-400 flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">No posters created yet</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Start designing your first campus competition flyer or choose from our pre-made hackathon and symposium templates.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={onOpenCreateModal}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Blank Poster</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* Create New Poster Card */}
                <div
                  onClick={onOpenCreateModal}
                  className="rounded-2xl border-2 border-dashed border-slate-800 hover:border-indigo-500 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex flex-col items-center justify-center p-8 text-center gap-3 cursor-pointer min-h-[300px]"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Create New Poster</p>
                    <p className="text-xs text-slate-400 mt-1">Start from blank canvas or custom size</p>
                  </div>
                </div>

                {/* Existing Designs */}
                {designs.map(design => (
                  <div
                    key={design.id}
                    className="group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 hover:border-indigo-500/80 transition-all flex flex-col shadow-md"
                  >
                    {/* Thumbnail View */}
                    <div
                      onClick={() => onEditDesign(design)}
                      className="aspect-[3/4] w-full bg-slate-950 relative overflow-hidden cursor-pointer"
                    >
                      {design.thumbnailUrl ? (
                        <img
                          src={resolveImageUrl(design.thumbnailUrl)}
                          alt={design.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = IMAGE_ASSETS.heroMockup;
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 text-xs gap-1">
                          <Layers className="w-8 h-8" />
                          <span>No Preview</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow">
                          Open in Editor
                        </span>
                      </div>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-white truncate" title={design.title}>
                          {design.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>{design.dimensionName || 'A4 Portrait'}</span>
                          <span>·</span>
                          <span>{new Date(design.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Card Button Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <button
                          onClick={() => onEditDesign(design)}
                          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDuplicate(design.id)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Duplicate poster"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDownload(design)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Quick download thumbnail"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(design.id, design.title)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete poster"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
