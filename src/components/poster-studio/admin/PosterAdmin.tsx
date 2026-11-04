import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Plus, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  Download, 
  LayoutTemplate,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';
import { PosterTemplate, TemplateCategory } from '../../../types';
import { StorageService, StudioStats } from '../../../services/storage';
import { IMAGE_ASSETS } from '../../../assets/imageAssets';

interface PosterAdminProps {
  templates: PosterTemplate[];
  onRefreshTemplates: () => void;
  onEditTemplateInCanvas: (template: PosterTemplate) => void;
}

export const PosterAdmin: React.FC<PosterAdminProps> = ({
  templates,
  onRefreshTemplates,
  onEditTemplateInCanvas
}) => {
  const [stats, setStats] = useState<StudioStats>(StorageService.getStats());
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TemplateCategory>('Hackathon');
  const [newDesc, setNewDesc] = useState('');

  const handleToggleActive = (tpl: PosterTemplate) => {
    StorageService.updateTemplate({ ...tpl, isActive: !tpl.isActive });
    onRefreshTemplates();
  };

  const handleToggleFeatured = (tpl: PosterTemplate) => {
    StorageService.updateTemplate({ ...tpl, isFeatured: !tpl.isFeatured });
    onRefreshTemplates();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete public template "${name}"?`)) {
      StorageService.deleteTemplate(id);
      onRefreshTemplates();
    }
  };

  const handleCreateTemplate = () => {
    if (!newTitle.trim()) return;
    const newTpl: PosterTemplate = {
      id: 'tpl_custom_' + Date.now(),
      name: newTitle.trim(),
      category: newCategory,
      thumbnailUrl: IMAGE_ASSETS.heroMockup,
      canvasWidth: 794,
      canvasHeight: 1123,
      dimensionName: 'A4 Portrait',
      description: newDesc.trim() || 'Custom administrator template layout.',
      tags: ['Admin', newCategory],
      isActive: true,
      isFeatured: false,
      designJson: {
        version: '5.3.0',
        objects: [
          {
            type: 'rect',
            left: 60,
            top: 60,
            width: 674,
            height: 1003,
            fill: '#1e293b',
            rx: 16,
            ry: 16
          },
          {
            type: 'textbox',
            left: 100,
            top: 140,
            width: 594,
            text: newTitle.toUpperCase(),
            fontSize: 52,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill: '#ffffff',
            textAlign: 'center'
          }
        ],
        background: '#0f172a'
      },
      createdAt: new Date().toISOString()
    };

    StorageService.addTemplate(newTpl);
    onRefreshTemplates();
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Poster Studio Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage public template catalogs, feature high-demand layouts, and audit design telemetry.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Template</span>
          </button>
        </div>

        {/* Telemetry Stats Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Designs Created</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{stats.totalDesignsCreated}</p>
            <p className="text-[11px] text-emerald-400">Campus-wide user activity</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Total Downloads & Exports</span>
              <Download className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">{stats.totalExports}</p>
            <p className="text-[11px] text-emerald-400">PDF, PNG & JPG generated</p>
          </div>

          <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Active Templates</span>
              <LayoutTemplate className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white font-mono">
              {templates.filter(t => t.isActive).length} / {templates.length}
            </p>
            <p className="text-[11px] text-slate-400">Available in public picker</p>
          </div>
        </div>

        {/* Template Catalog Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Public Template Catalog</h2>
            <span className="text-xs text-slate-400">{templates.length} Total Templates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Template</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Format</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold">Featured</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {templates.map((tpl) => (
                  <tr key={tpl.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={tpl.thumbnailUrl}
                          alt={tpl.name}
                          className="w-10 h-14 object-cover rounded bg-slate-950 shrink-0 border border-slate-800"
                        />
                        <div>
                          <p className="font-bold text-white truncate max-w-xs">{tpl.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{tpl.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{tpl.category}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {tpl.dimensionName} ({tpl.canvasWidth}×{tpl.canvasHeight})
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(tpl)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium cursor-pointer ${
                          tpl.isActive 
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' 
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {tpl.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{tpl.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleFeatured(tpl)}
                        className={`p-1.5 rounded transition-colors cursor-pointer ${
                          tpl.isFeatured ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                        }`}
                        title={tpl.isFeatured ? 'Featured on home' : 'Click to feature'}
                      >
                        <Star className={`w-4 h-4 ${tpl.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditTemplateInCanvas(tpl)}
                          className="px-2.5 py-1 text-xs font-semibold text-indigo-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                        >
                          Edit Canvas
                        </button>
                        <button
                          onClick={() => handleDelete(tpl.id, tpl.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors cursor-pointer"
                          title="Delete template"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Template Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Add New Poster Template</h3>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Template Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Robotics Showcase 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as TemplateCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Hackathon">Hackathon</option>
                  <option value="University Event">University Event</option>
                  <option value="Technology">Technology</option>
                  <option value="Competition">Competition</option>
                  <option value="Business">Business</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Sports">Sports</option>
                  <option value="Creative & Minimal">Creative & Minimal</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Brief summary of template design use case"
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer"
                >
                  Publish Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
