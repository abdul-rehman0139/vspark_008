import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Grid, 
  Save, 
  Download, 
  FileText,
  Image as ImageIcon,
  Check,
  ChevronDown
} from 'lucide-react';
import { fabric } from 'fabric';
import { CanvasExportHelpers } from './fabricUtils';
import confetti from 'canvas-confetti';

interface TopToolbarProps {
  canvas: fabric.Canvas | null;
  docTitle: string;
  onTitleChange: (newTitle: string) => void;
  dimensionName: string;
  width: number;
  height: number;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onFitCanvas: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onBack: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  canvas,
  docTitle,
  onTitleChange,
  dimensionName,
  width,
  height,
  zoom,
  onZoomChange,
  onFitCanvas,
  showGrid,
  onToggleGrid,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  isSaving,
  hasUnsavedChanges,
  onBack
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'jpg' | 'pdf'>('png');
  const [transparentBg, setTransparentBg] = useState(false);
  const [exportQuality, setExportQuality] = useState<2 | 1>(2);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleExport = (format: 'png' | 'jpg' | 'pdf') => {
    if (!canvas) return;
    const sanitizedTitle = docTitle.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'vspark_poster';

    if (format === 'png') {
      CanvasExportHelpers.downloadPNG(canvas, `${sanitizedTitle}.png`, exportQuality, transparentBg);
    } else if (format === 'jpg') {
      CanvasExportHelpers.downloadJPG(canvas, `${sanitizedTitle}.jpg`, exportQuality, 0.95);
    } else if (format === 'pdf') {
      CanvasExportHelpers.downloadPDF(canvas, `${sanitizedTitle}.pdf`, docTitle);
    }

    setShowExportMenu(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.1, x: 0.85 }
    });
  };

  return (
    <header className="h-14 bg-slate-950 border-b border-slate-800 px-2 sm:px-4 flex items-center justify-between gap-1.5 sm:gap-4 text-slate-200 select-none z-20 shrink-0">
      {/* Zone 1: Back + Doc Title */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
          title="Back to Poster Studio"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Studio</span>
        </button>

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        {/* Editable Title */}
        <div className="flex items-center gap-1.5 min-w-0">
          <input
            type="text"
            value={docTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            className="bg-transparent hover:bg-slate-900 focus:bg-slate-900 border border-transparent hover:border-slate-800 focus:border-indigo-500 rounded px-1.5 sm:px-2 py-1 text-xs sm:text-sm font-semibold text-slate-100 focus:outline-none transition-colors max-w-[100px] xs:max-w-[130px] sm:max-w-[200px] md:max-w-[260px] truncate"
            title="Click to rename poster"
          />
          <span className="hidden lg:inline-block text-[11px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            {dimensionName}
          </span>
        </div>
      </div>

      {/* Zone 2: History & Canvas Viewport Controls */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded ${canUndo ? 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer' : 'text-slate-600 cursor-not-allowed'}`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded ${canRedo ? 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer' : 'text-slate-600 cursor-not-allowed'}`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Zoom Controls (desktop) */}
        <div className="hidden lg:flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => onZoomChange(Math.max(0.2, zoom - 0.1))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono px-2 text-slate-300 min-w-[48px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(2.5, zoom + 0.1))}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onFitCanvas}
            className="px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded cursor-pointer"
            title="Fit Canvas to Screen"
          >
            Fit
          </button>
        </div>

        {/* Fit canvas icon button (mobile/tablet) */}
        <button
          onClick={onFitCanvas}
          className="lg:hidden p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800 cursor-pointer text-[10px] font-medium"
          title="Fit Canvas"
        >
          Fit
        </button>

        {/* Grid Toggle */}
        <button
          onClick={onToggleGrid}
          className={`hidden sm:flex p-1.5 rounded-lg border transition-colors cursor-pointer ${
            showGrid 
              ? 'bg-indigo-950/60 text-indigo-400 border-indigo-500/50' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Alignment Grid"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="hidden md:flex p-1.5 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 rounded-lg transition-colors cursor-pointer"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Zone 3: Save & Export Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0">
        {/* Autosave Status */}
        <span className="hidden xl:inline text-[11px] text-slate-400">
          {isSaving ? 'Saving...' : hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
        </span>

        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500 rounded-lg text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          title="Save (Ctrl+S)"
        >
          <Save className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden xs:inline">Save</span>
        </button>

        {/* Export / Download Menu */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Download</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 top-11 w-72 max-w-[calc(100vw-24px)] bg-slate-950 border border-slate-800 rounded-xl shadow-xl p-3 z-50 text-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-slate-200">Export Poster</span>
                <span className="text-[10px] text-slate-400">High-Fidelity Output</span>
              </div>

              {/* Format Select */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">File Type</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setDownloadFormat('png')}
                    className={`py-1.5 text-xs font-medium rounded-md flex flex-col items-center gap-0.5 border cursor-pointer ${
                      downloadFormat === 'png'
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>PNG</span>
                  </button>
                  <button
                    onClick={() => setDownloadFormat('jpg')}
                    className={`py-1.5 text-xs font-medium rounded-md flex flex-col items-center gap-0.5 border cursor-pointer ${
                      downloadFormat === 'jpg'
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>JPG</span>
                  </button>
                  <button
                    onClick={() => setDownloadFormat('pdf')}
                    className={`py-1.5 text-xs font-medium rounded-md flex flex-col items-center gap-0.5 border cursor-pointer ${
                      downloadFormat === 'pdf'
                        ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>PDF Print</span>
                  </button>
                </div>
              </div>

              {/* Resolution multiplier */}
              {downloadFormat !== 'pdf' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Quality</label>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => setExportQuality(1)}
                      className={`py-1 rounded border cursor-pointer ${
                        exportQuality === 1 
                          ? 'bg-indigo-950 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      1× Standard
                    </button>
                    <button
                      onClick={() => setExportQuality(2)}
                      className={`py-1 rounded border cursor-pointer ${
                        exportQuality === 2 
                          ? 'bg-indigo-950 border-indigo-500 text-indigo-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      2× Ultra HD (Print)
                    </button>
                  </div>
                </div>
              )}

              {/* Transparent toggle for PNG */}
              {downloadFormat === 'png' && (
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={transparentBg}
                    onChange={(e) => setTransparentBg(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Transparent Background</span>
                </label>
              )}

              {/* Confirm Export Button */}
              <button
                onClick={() => handleExport(downloadFormat)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export {downloadFormat.toUpperCase()}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
