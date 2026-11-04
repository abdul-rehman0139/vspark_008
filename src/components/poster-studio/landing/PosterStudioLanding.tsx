import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Heart, 
  Layers, 
  Type, 
  Download, 
  Zap, 
  Palette, 
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { PosterTemplate, TemplateCategory } from '../../../types';
import { StorageService } from '../../../services/storage';
import { IMAGE_ASSETS } from '../../../assets/imageAssets';

interface PosterStudioLandingProps {
  templates: PosterTemplate[];
  onOpenCreateModal: () => void;
  onSelectTemplate: (template: PosterTemplate) => void;
  onOpenDashboard: () => void;
}

export const PosterStudioLanding: React.FC<PosterStudioLandingProps> = ({
  templates,
  onOpenCreateModal,
  onSelectTemplate,
  onOpenDashboard
}) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(StorageService.getFavorites());

  const categories: (TemplateCategory | 'All')[] = [
    'All',
    'Hackathon',
    'University Event',
    'Technology',
    'Competition',
    'Business',
    'Workshop',
    'Sports',
    'Creative & Minimal',
    'Social Media',
    'Educational'
  ];

  const filteredTemplates = templates.filter((tpl) => {
    const matchesCat = selectedCategory === 'All' || tpl.category === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleToggleFavorite = (tplId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.toggleFavorite(tplId);
    setFavorites(StorageService.getFavorites());
  };

  const scrollToTemplates = () => {
    const el = document.getElementById('template-library-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-900 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Visual Design for Campus Leaders</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Bring Your Ideas to Life.
              </h1>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl">
                Create stunning professional posters with powerful design tools, beautiful templates, and unlimited creativity. Built natively into the VSpark platform.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenCreateModal}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <span>Create Your Poster</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={scrollToTemplates}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                >
                  Explore Templates
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="flex items-center gap-6 pt-6 text-xs text-slate-400 border-t border-slate-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>300 DPI Print Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Vector Shapes & Typography</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free Instant PDF Export</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Mockup Asset */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src={IMAGE_ASSETS.heroMockup}
                  alt="VSpark Poster Studio Mockup"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-100">Live Interactive Canvas</p>
                    <p className="text-[11px] text-slate-400">Drag, drop, rotate, and export with zero lag</p>
                  </div>
                  <button
                    onClick={onOpenCreateModal}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE PILLARS */}
      <section className="py-16 border-b border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Designed for Speed. Engineered for Impact.
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Everything you need to produce university event flyers, conference banners, and hackathon posters in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                <Type className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Precision Typography</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose from curated poster typefaces including Montserrat, Anton, Playfair Display, and Space Mono with custom letter spacing, shadows, and strokes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Vector Layer Management</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reorder shapes, lock backgrounds, group assets, and snap elements with intelligent canvas alignment guides.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Print-Ready PDF & HD PNG</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export lossless vector PDFs for campus printing boards or 2× Ultra-HD PNG and JPG graphics optimized for Instagram and LinkedIn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATE GALLERY SECTION */}
      <section id="template-library-section" className="py-16 bg-slate-950 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                <Palette className="w-3.5 h-3.5" />
                <span>Template Library</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Explore Poster Templates
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Fully editable layouts crafted for hackathons, academic conferences, and cultural fests.
              </p>
            </div>

            {/* Search & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button
                onClick={onOpenDashboard}
                className="px-4 py-2 text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap text-center"
              >
                My Designs
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="py-16 text-center border border-slate-900 rounded-2xl bg-slate-900/30">
              <p className="text-sm font-semibold text-slate-300">No templates found</p>
              <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword or category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTemplates.map((template) => {
                const isFav = favorites.includes(template.id);
                return (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="group relative rounded-2xl overflow-hidden border border-slate-800/90 bg-slate-900 flex flex-col hover:border-indigo-500 transition-all duration-300 cursor-pointer shadow-md hover:shadow-indigo-500/10"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[3/4] w-full bg-slate-950 relative overflow-hidden">
                      <img
                        src={template.thumbnailUrl}
                        alt={template.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = IMAGE_ASSETS.heroMockup;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleToggleFavorite(template.id, e)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isFav
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-950/60 text-slate-300 hover:text-rose-400'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>

                      {/* Category Label */}
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-md text-[10px] font-medium text-slate-300 border border-slate-800">
                        {template.category}
                      </div>

                      {/* Hover Overlay Button */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                        <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          Customize Template
                        </span>
                      </div>
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
                          {template.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <span>{template.dimensionName}</span>
                        <span className="text-indigo-400 font-medium group-hover:underline">Edit Canvas →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
