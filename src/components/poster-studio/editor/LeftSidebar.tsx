import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutTemplate, 
  Type, 
  Shapes, 
  Upload, 
  Palette, 
  Layers, 
  FolderHeart,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sparkles,
  Trophy,
  Calendar,
  MapPin,
  Code,
  Music,
  Users,
  Award,
  Globe,
  Rocket,
  X
} from 'lucide-react';
import { fabric } from 'fabric';
import { CanvasAddHelpers } from './fabricUtils';
import { PosterTemplate, UploadedAsset, PosterDesign } from '../../../types';
import { StorageService } from '../../../services/storage';
import { resolveImageUrl, IMAGE_ASSETS } from '../../../assets/imageAssets';

export type LeftSidebarTab = 'templates' | 'text' | 'elements' | 'uploads' | 'backgrounds' | 'layers' | 'designs';

export interface LeftSidebarProps {
  canvas: fabric.Canvas | null;
  templates: PosterTemplate[];
  onSelectTemplate: (template: PosterTemplate) => void;
  savedDesigns: PosterDesign[];
  onOpenDesign: (design: PosterDesign) => void;
  onCanvasModified: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activeTabMobile?: LeftSidebarTab;
  onTabChangeMobile?: (tab: LeftSidebarTab) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  canvas,
  templates,
  onSelectTemplate,
  savedDesigns,
  onOpenDesign,
  onCanvasModified,
  isOpenMobile,
  onCloseMobile,
  activeTabMobile,
  onTabChangeMobile
}) => {
  const [activeTab, setActiveTab] = useState<LeftSidebarTab>(activeTabMobile || 'templates');

  useEffect(() => {
    if (activeTabMobile) {
      setActiveTab(activeTabMobile);
    }
  }, [activeTabMobile]);

  const handleTabChange = (tab: LeftSidebarTab) => {
    setActiveTab(tab);
    onTabChangeMobile?.(tab);
  };

  const handleSelectTemplateWrapped = (t: PosterTemplate) => {
    onSelectTemplate(t);
    onCloseMobile?.();
  };

  const handleOpenDesignWrapped = (d: PosterDesign) => {
    onOpenDesign(d);
    onCloseMobile?.();
  };
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [uploads, setUploads] = useState<UploadedAsset[]>(StorageService.getUploads());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter templates
  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
                          t.description.toLowerCase().includes(templateSearch.toLowerCase()) ||
                          t.tags.some(tag => tag.toLowerCase().includes(templateSearch.toLowerCase()));
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['All', 'Hackathon', 'University Event', 'Business', 'Workshop', 'Sports', 'Creative & Minimal', 'Social Media'];

  // Handle image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please select a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newAsset: UploadedAsset = {
          id: 'up_' + Date.now(),
          name: file.name,
          dataUrl: event.target.result as string,
          type: file.type,
          size: file.size,
          createdAt: new Date().toISOString()
        };
        const updated = StorageService.saveUpload(newAsset);
        setUploads(updated);

        // Auto-add to canvas if user uploaded
        if (canvas) {
          CanvasAddHelpers.addImageFromUrl(canvas, newAsset.dataUrl, () => {
            onCanvasModified();
          });
        }
      }
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteUpload = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = StorageService.deleteUpload(id);
    setUploads(updated);
  };

  // Add Icon Helper (SVG path as fabric object)
  const addIcon = (iconName: string) => {
    if (!canvas) return;
    const iconColors: Record<string, string> = {
      trophy: '#facc15',
      code: '#38bdf8',
      calendar: '#a855f7',
      mapPin: '#ef4444',
      music: '#ec4899',
      rocket: '#f97316',
      globe: '#10b981',
      award: '#eab308',
      users: '#6366f1'
    };

    const color = iconColors[iconName] || '#ffffff';
    // We add stylized badge with the icon symbol
    CanvasAddHelpers.addBadge(canvas, iconName.toUpperCase());
    onCanvasModified();
  };

  // Preset Text Combos
  const addTypographyPreset = (preset: 'neon' | 'impact' | 'academic' | 'minimal') => {
    if (!canvas) return;
    if (preset === 'neon') {
      CanvasAddHelpers.addHeading(canvas, 'CYBER HORIZON', {
        fontFamily: 'Montserrat',
        fontWeight: '900',
        fill: '#f43f5e',
        fontSize: 54,
        shadow: new fabric.Shadow({ color: '#f43f5e', blur: 24, offsetX: 0, offsetY: 0 })
      });
      CanvasAddHelpers.addSubheading(canvas, 'NEXT-GEN CODE SUMMIT', {
        fontFamily: 'Space Mono',
        fill: '#38bdf8',
        fontSize: 18,
        charSpacing: 200
      });
    } else if (preset === 'impact') {
      CanvasAddHelpers.addHeading(canvas, 'ANNUAL FINALS', {
        fontFamily: 'Anton',
        fill: '#facc15',
        fontSize: 64
      });
      CanvasAddHelpers.addSubheading(canvas, 'THE CHAMPIONSHIP STAGE', {
        fontFamily: 'Montserrat',
        fontWeight: 'bold',
        fill: '#ffffff',
        fontSize: 20,
        charSpacing: 100
      });
    } else if (preset === 'academic') {
      CanvasAddHelpers.addHeading(canvas, 'Keynote Address', {
        fontFamily: 'Playfair Display',
        fontWeight: 'bold',
        fill: '#fef08a',
        fontSize: 48
      });
      CanvasAddHelpers.addSubheading(canvas, 'Perspectives on Global Innovation', {
        fontFamily: 'Playfair Display',
        fontStyle: 'italic',
        fill: '#cbd5e1',
        fontSize: 20
      });
    } else {
      CanvasAddHelpers.addHeading(canvas, 'LESS IS MORE', {
        fontFamily: 'Montserrat',
        fontWeight: '900',
        fill: '#0f172a',
        fontSize: 44,
        charSpacing: 150
      });
    }
    onCanvasModified();
  };

  // Background Presets
  const setCanvasBgColor = (color: string) => {
    if (!canvas) return;
    canvas.setBackgroundColor(color, () => {
      canvas.renderAll();
      onCanvasModified();
    });
  };

  const bgPresets = [
    { name: 'Dark Slate', value: '#0f172a' },
    { name: 'Deep Cosmic', value: '#090d16' },
    { name: 'Midnight Violet', value: '#1e1b4b' },
    { name: 'Emerald Forest', value: '#064e3b' },
    { name: 'Warm Bauhaus Cream', value: '#f4efe6' },
    { name: 'Pure White', value: '#ffffff' },
    { name: 'Pitch Black', value: '#000000' },
    { name: 'Rich Crimson', value: '#450a0a' },
    { name: 'Royal Navy', value: '#0a1428' },
  ];

  // Layers list
  const getCanvasObjects = () => {
    if (!canvas) return [];
    return canvas.getObjects().slice().reverse(); // Top layer first
  };

  return (
    <div
      className={`${
        isOpenMobile
          ? 'fixed inset-0 z-50 flex lg:hidden animate-fade-in'
          : 'hidden lg:flex'
      } h-full bg-slate-900 border-r border-slate-800 text-slate-200 select-none z-10 shrink-0`}
    >
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs -z-10"
          onClick={onCloseMobile}
        />
      )}
      <div className="flex h-full w-full max-w-sm sm:max-w-md lg:max-w-none shadow-2xl lg:shadow-none bg-slate-900">
        {/* Icon Nav Bar */}
        <div className="w-16 sm:w-18 flex flex-col items-center py-3 sm:py-4 bg-slate-950/70 border-r border-slate-800/80 gap-1 shrink-0 overflow-y-auto">
        <button
          onClick={() => setActiveTab('templates')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'templates' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="Templates"
        >
          <LayoutTemplate className="w-5 h-5" />
          <span className="font-medium tracking-tight">Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'text' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="Text"
        >
          <Type className="w-5 h-5" />
          <span className="font-medium tracking-tight">Text</span>
        </button>

        <button
          onClick={() => setActiveTab('elements')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'elements' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="Shapes & Elements"
        >
          <Shapes className="w-5 h-5" />
          <span className="font-medium tracking-tight">Elements</span>
        </button>

        <button
          onClick={() => setActiveTab('uploads')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'uploads' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="Upload Images"
        >
          <Upload className="w-5 h-5" />
          <span className="font-medium tracking-tight">Uploads</span>
        </button>

        <button
          onClick={() => setActiveTab('backgrounds')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'backgrounds' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="Backgrounds"
        >
          <Palette className="w-5 h-5" />
          <span className="font-medium tracking-tight">Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'layers' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="Layers"
        >
          <Layers className="w-5 h-5" />
          <span className="font-medium tracking-tight">Layers</span>
        </button>

        <button
          onClick={() => setActiveTab('designs')}
          className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] transition-all cursor-pointer ${
            activeTab === 'designs' 
              ? 'bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 shadow-sm' 
              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
          }`}
          title="My Designs"
        >
          <FolderHeart className="w-5 h-5" />
          <span className="font-medium tracking-tight">My Files</span>
        </button>
      </div>

      {/* Tab Drawer Content */}
      <div className="flex-1 lg:w-80 h-full flex flex-col overflow-hidden bg-slate-900/95 border-r border-slate-800">
        {/* Mobile Header with close button */}
        <div className="flex lg:hidden items-center justify-between px-3.5 py-2.5 bg-slate-950 border-b border-slate-800 shrink-0">
          <span className="font-semibold text-sm capitalize text-slate-100">{activeTab}</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TEMPLATES TAB */}
        {activeTab === 'templates' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <h3 className="text-base font-semibold text-slate-100 mb-1">Poster Templates</h3>
            <p className="text-xs text-slate-400 mb-3">Pick an original layout to customize instantly</p>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search hackathon, symposium..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[11px] px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-2 gap-3">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleSelectTemplateWrapped(tpl)}
                  className="group relative rounded-lg overflow-hidden border border-slate-800 bg-slate-950 hover:border-indigo-500 transition-all cursor-pointer shadow-sm hover:shadow-indigo-500/10 flex flex-col"
                >
                  <div className="aspect-[3/4] w-full bg-slate-950 relative overflow-hidden">
                    <img
                      src={resolveImageUrl(tpl.thumbnailUrl)}
                      alt={tpl.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = IMAGE_ASSETS.heroMockup;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                      <span className="text-[10px] font-medium text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded">
                        Use Template
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-slate-200 truncate">{tpl.name}</p>
                    <p className="text-[10px] text-slate-400">{tpl.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEXT TAB */}
        {activeTab === 'text' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">Add Typography</h3>
              <p className="text-xs text-slate-400">Click to add text elements onto the poster canvas</p>
            </div>

            {/* Basic Text Element Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  if (canvas) {
                    CanvasAddHelpers.addHeading(canvas, 'Add Big Headline');
                    onCanvasModified();
                  }
                }}
                className="w-full py-3 px-4 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-left text-lg font-bold text-slate-100 hover:text-indigo-400 transition-all cursor-pointer"
              >
                Add a Heading
              </button>

              <button
                onClick={() => {
                  if (canvas) {
                    CanvasAddHelpers.addSubheading(canvas, 'Add Subheading');
                    onCanvasModified();
                  }
                }}
                className="w-full py-2.5 px-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-lg text-left text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-all cursor-pointer"
              >
                Add a Subheading
              </button>

              <button
                onClick={() => {
                  if (canvas) {
                    CanvasAddHelpers.addParagraph(canvas);
                    onCanvasModified();
                  }
                }}
                className="w-full py-2.5 px-4 bg-slate-800/30 hover:bg-slate-800 border border-slate-700/40 rounded-lg text-left text-xs text-slate-400 hover:text-indigo-300 transition-all cursor-pointer"
              >
                Add a Body Paragraph
              </button>
            </div>

            {/* Stylized Font Combinations */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Designer Font Pairs
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => addTypographyPreset('neon')}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-pink-500 rounded-lg text-left transition-all cursor-pointer"
                >
                  <p className="text-pink-400 font-extrabold text-sm tracking-wide">CYBER HORIZON</p>
                  <p className="text-[10px] font-mono text-cyan-300">NEXT-GEN CODE SUMMIT</p>
                </button>

                <button
                  onClick={() => addTypographyPreset('impact')}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-lg text-left transition-all cursor-pointer"
                >
                  <p className="text-amber-400 font-black text-sm tracking-wider uppercase font-anton">ANNUAL FINALS</p>
                  <p className="text-[10px] text-slate-300 font-semibold tracking-widest">THE CHAMPIONSHIP STAGE</p>
                </button>

                <button
                  onClick={() => addTypographyPreset('academic')}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-amber-300 rounded-lg text-left transition-all cursor-pointer"
                >
                  <p className="text-yellow-200 font-bold text-sm font-serif">Keynote Address</p>
                  <p className="text-[10px] italic text-slate-400 font-serif">Perspectives on Global Innovation</p>
                </button>

                <button
                  onClick={() => addTypographyPreset('minimal')}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-slate-500 rounded-lg text-left transition-all cursor-pointer"
                >
                  <p className="text-slate-100 font-black text-sm tracking-widest">LESS IS MORE</p>
                  <p className="text-[10px] text-slate-400">Bauhaus Modernism</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ELEMENTS & SHAPES TAB */}
        {activeTab === 'elements' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">Shapes & Badges</h3>
              <p className="text-xs text-slate-400">Drag or click to place shapes on the canvas</p>
            </div>

            {/* Basic Geometric Shapes */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Geometric Shapes</h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addRect(canvas);
                      onCanvasModified();
                    }
                  }}
                  className="h-20 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded bg-indigo-500" />
                  <span className="text-[11px] text-slate-300">Rectangle</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addCircle(canvas);
                      onCanvasModified();
                    }
                  }}
                  className="h-20 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-cyan-500" />
                  <span className="text-[11px] text-slate-300">Circle</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addTriangle(canvas);
                      onCanvasModified();
                    }
                  }}
                  className="h-20 bg-slate-950 border border-slate-800 hover:border-amber-500 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-amber-500" />
                  <span className="text-[11px] text-slate-300">Triangle</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addLine(canvas);
                      onCanvasModified();
                    }
                  }}
                  className="h-20 bg-slate-950 border border-slate-800 hover:border-slate-400 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <div className="w-10 h-0.5 bg-slate-200" />
                  <span className="text-[11px] text-slate-300">Divider Line</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addStar(canvas);
                      onCanvasModified();
                    }
                  }}
                  className="h-20 bg-slate-950 border border-slate-800 hover:border-yellow-400 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <span className="text-[11px] text-slate-300">5-Pt Star</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addBadge(canvas, 'FREE ENTRY');
                      onCanvasModified();
                    }
                  }}
                  className="h-20 bg-slate-950 border border-slate-800 hover:border-indigo-400 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <div className="px-2 py-0.5 rounded-full bg-indigo-700 text-[9px] text-indigo-100 font-bold">
                    BADGE
                  </div>
                  <span className="text-[11px] text-slate-300">Pill Tag</span>
                </button>
              </div>
            </div>

            {/* Quick Graphic Badges */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Event Badges</h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addBadge(canvas, '★ CASH PRIZES ★');
                      onCanvasModified();
                    }
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-amber-400 rounded-lg flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium truncate">Prize Badge</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addBadge(canvas, 'HACKATHON 2026');
                      onCanvasModified();
                    }
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-sky-400 rounded-lg flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <Code className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium truncate">Code Badge</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addBadge(canvas, 'DEC 15 · CAMPUS');
                      onCanvasModified();
                    }
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-purple-400 rounded-lg flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium truncate">Date Badge</span>
                </button>

                <button
                  onClick={() => {
                    if (canvas) {
                      CanvasAddHelpers.addBadge(canvas, 'LIVE STAGE');
                      onCanvasModified();
                    }
                  }}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-pink-400 rounded-lg flex items-center gap-2 transition-all cursor-pointer text-left"
                >
                  <Music className="w-4 h-4 text-pink-400 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium truncate">Music Badge</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPLOADS TAB */}
        {activeTab === 'uploads' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">Your Media</h3>
              <p className="text-xs text-slate-400">Upload logos, sponsor branding, or photos</p>
            </div>

            {/* Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-4 border-2 border-dashed border-indigo-500/50 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/30 rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-6 h-6 text-indigo-400" />
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-200">Upload Media</p>
                <p className="text-[10px] text-slate-400">PNG, JPG, WEBP, SVG (max 5MB)</p>
              </div>
            </button>

            {/* Uploaded Gallery */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Uploaded Images ({uploads.length})
                </span>
              </div>

              {uploads.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs border border-slate-800/80 rounded-lg">
                  No images uploaded yet. Upload sponsor logos or photos to place on your poster.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {uploads.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => {
                        if (canvas) {
                          CanvasAddHelpers.addImageFromUrl(canvas, asset.dataUrl, () => {
                            onCanvasModified();
                          });
                        }
                      }}
                      className="group relative aspect-square rounded-lg bg-slate-950 border border-slate-800 overflow-hidden hover:border-indigo-500 cursor-pointer"
                    >
                      <img
                        src={asset.dataUrl}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={(e) => handleDeleteUpload(asset.id, e)}
                        className="absolute top-1 right-1 p-1 bg-rose-950/80 hover:bg-rose-600 text-rose-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* BACKGROUNDS TAB */}
        {activeTab === 'backgrounds' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">Canvas Background</h3>
              <p className="text-xs text-slate-400">Set solid tones or high-contrast backdrops</p>
            </div>

            {/* Solid Presets */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Palette Colors</h4>
              <div className="grid grid-cols-3 gap-2">
                {bgPresets.map((bg) => (
                  <button
                    key={bg.value}
                    onClick={() => setCanvasBgColor(bg.value)}
                    className="p-2 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-lg flex flex-col items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-slate-700 shadow-sm"
                      style={{ backgroundColor: bg.value }}
                    />
                    <span className="text-[10px] text-slate-300 text-center leading-tight truncate w-full">
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
              <label className="text-xs text-slate-300 font-medium block mb-1.5">Custom Hex Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  onChange={(e) => setCanvasBgColor(e.target.value)}
                  className="w-9 h-9 rounded bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  placeholder="#0f172a"
                  onBlur={(e) => {
                    if (e.target.value) setCanvasBgColor(e.target.value);
                  }}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* LAYERS TAB */}
        {activeTab === 'layers' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto space-y-3">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">Layer Ordering</h3>
              <p className="text-xs text-slate-400">Manage order, visibility, and element locking</p>
            </div>

            {(!canvas || getCanvasObjects().length === 0) ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-slate-800/80 rounded-lg">
                Canvas is currently empty. Add text, shapes, or templates to see layers.
              </div>
            ) : (
              <div className="space-y-1.5">
                {getCanvasObjects().map((obj, idx) => {
                  const isSelected = canvas.getActiveObject() === obj;
                  const isLocked = obj.lockMovementX && obj.lockMovementY;
                  const isHidden = !obj.visible;
                  const typeLabel = obj.type === 'textbox' || obj.type === 'text' 
                    ? `Text: "${(obj as any).text?.substring(0, 15)}..."` 
                    : obj.type === 'image' 
                    ? 'Image Layer' 
                    : `${obj.type?.toUpperCase()} Shape`;

                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        canvas.setActiveObject(obj);
                        canvas.renderAll();
                        onCanvasModified();
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="truncate max-w-[150px] font-medium">{typeLabel}</span>
                      <div className="flex items-center gap-1">
                        {/* Lock Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newLocked = !isLocked;
                            obj.set({
                              lockMovementX: newLocked,
                              lockMovementY: newLocked,
                              lockRotation: newLocked,
                              lockScalingX: newLocked,
                              lockScalingY: newLocked
                            });
                            canvas.renderAll();
                            onCanvasModified();
                          }}
                          className="p-1 hover:text-slate-100 text-slate-400"
                          title={isLocked ? 'Unlock layer' : 'Lock layer'}
                        >
                          {isLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            obj.set({ visible: !obj.visible });
                            canvas.renderAll();
                            onCanvasModified();
                          }}
                          className="p-1 hover:text-slate-100 text-slate-400"
                          title={isHidden ? 'Show layer' : 'Hide layer'}
                        >
                          {isHidden ? <EyeOff className="w-3.5 h-3.5 text-slate-500" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>

                        {/* Delete Layer */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            canvas.remove(obj);
                            canvas.discardActiveObject();
                            canvas.renderAll();
                            onCanvasModified();
                          }}
                          className="p-1 hover:text-rose-400 text-slate-500"
                          title="Delete layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* MY DESIGNS TAB */}
        {activeTab === 'designs' && (
          <div className="flex flex-col h-full p-4 overflow-y-auto space-y-3">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-1">Saved Designs</h3>
              <p className="text-xs text-slate-400">Open previously customized posters</p>
            </div>

            {savedDesigns.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-slate-800/80 rounded-lg">
                No saved posters yet. Click "Save" on the top toolbar to store your current creation.
              </div>
            ) : (
              <div className="space-y-2">
                {savedDesigns.map((design) => (
                  <div
                    key={design.id}
                    onClick={() => handleOpenDesignWrapped(design)}
                    className="p-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500 rounded-lg flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <div className="w-12 h-16 bg-slate-900 rounded overflow-hidden shrink-0 border border-slate-800">
                      {design.thumbnailUrl ? (
                        <img src={design.thumbnailUrl} alt={design.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-600">Poster</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{design.title}</p>
                      <p className="text-[10px] text-slate-400">{design.dimensionName || 'A4 Portrait'}</p>
                      <p className="text-[9px] text-indigo-400 mt-0.5">
                        {new Date(design.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);
};
