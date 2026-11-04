import React, { useState } from 'react';
import { X, Sparkles, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { PRESET_DIMENSIONS, CanvasDimension } from '../../types';

interface DimensionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBlank: (width: number, height: number, dimensionName: string, title?: string) => void;
  onBrowseTemplates: () => void;
}

export const DimensionPickerModal: React.FC<DimensionPickerModalProps> = ({
  isOpen,
  onClose,
  onStartBlank,
  onBrowseTemplates
}) => {
  const [selectedPreset, setSelectedPreset] = useState<CanvasDimension>(PRESET_DIMENSIONS[0]);
  const [isCustom, setIsCustom] = useState(false);
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(1200);
  const [posterTitle, setPosterTitle] = useState('New Poster Design');

  if (!isOpen) return null;

  const handleStart = () => {
    if (isCustom) {
      onStartBlank(customWidth, customHeight, 'Custom Size', posterTitle);
    } else {
      onStartBlank(selectedPreset.width, selectedPreset.height, selectedPreset.name, posterTitle);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create New Poster</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select a canvas format or choose custom dimensions</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {/* Document Name */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider">
              Poster Title
            </label>
            <input
              type="text"
              value={posterTitle}
              onChange={(e) => setPosterTitle(e.target.value)}
              placeholder="e.g. Campus Hackathon 2026 Flyer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Preset Formats Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Popular Canvas Presets
              </span>
              <button
                onClick={() => setIsCustom(!isCustom)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {isCustom ? 'Use Presets' : 'Custom Dimensions'}
              </button>
            </div>

            {!isCustom ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3">
                {PRESET_DIMENSIONS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`p-3 sm:p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500 shadow-sm'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <span className="text-xs font-bold text-slate-100">{preset.name}</span>
                        {preset.isPopular && (
                          <span className="text-[10px] font-medium text-indigo-400">Popular</span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-slate-400">
                        {preset.width} × {preset.height} px
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">{preset.unitDesc}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Width (pixels)</label>
                    <input
                      type="number"
                      min={200}
                      max={4000}
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value) || 800)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 font-medium block mb-1">Height (pixels)</label>
                    <input
                      type="number"
                      min={200}
                      max={4000}
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1200)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">
                  Tip: A4 at 96 DPI is 794 × 1123 px. High-resolution print uses 1588 × 2246 px.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-slate-950/60 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <button
            onClick={() => {
              onClose();
              onBrowseTemplates();
            }}
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center justify-center sm:justify-start gap-1.5 cursor-pointer py-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Or browse pre-made templates</span>
          </button>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              onClick={handleStart}
              className="flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Open Canvas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
