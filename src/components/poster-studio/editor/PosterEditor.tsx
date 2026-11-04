import React, { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { 
  LayoutTemplate, 
  Type, 
  Shapes, 
  Upload, 
  Layers, 
  Sliders, 
  Trash2, 
  X, 
  Maximize2 
} from 'lucide-react';
import { LeftSidebar, LeftSidebarTab } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import { TopToolbar } from './TopToolbar';
import { CanvasHistoryManager, CanvasExportHelpers } from './fabricUtils';
import { PosterDesign, PosterTemplate } from '../../../types';
import { StorageService, sanitizeDesignJson } from '../../../services/storage';

interface PosterEditorProps {
  initialDesign?: PosterDesign | null;
  initialTemplate?: PosterTemplate | null;
  onBack: () => void;
  onDesignSaved?: (design: PosterDesign) => void;
}

export const PosterEditor: React.FC<PosterEditorProps> = ({
  initialDesign,
  initialTemplate,
  onBack,
  onDesignSaved
}) => {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [historyManager, setHistoryManager] = useState<CanvasHistoryManager | null>(null);
  const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

  // Document metadata
  const [docId, setDocId] = useState<string>(
    initialDesign?.id || 'design_' + Date.now()
  );
  const [docTitle, setDocTitle] = useState<string>(
    initialDesign?.title || initialTemplate?.name || 'Untitled Poster'
  );
  const [dimensionName, setDimensionName] = useState<string>(
    initialDesign?.dimensionName || initialTemplate?.dimensionName || 'A4 Portrait'
  );
  const [canvasWidth, setCanvasWidth] = useState<number>(
    initialDesign?.canvasWidth || initialTemplate?.canvasWidth || 794
  );
  const [canvasHeight, setCanvasHeight] = useState<number>(
    initialDesign?.canvasHeight || initialTemplate?.canvasHeight || 1123
  );

  // Viewport & Editor state
  const [zoom, setZoom] = useState<number>(0.65);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  // Mobile state drawers
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState<boolean>(false);
  const [isMobilePropsOpen, setIsMobilePropsOpen] = useState<boolean>(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<LeftSidebarTab>('templates');

  // Templates & Saved designs in drawer
  const [templates, setTemplates] = useState<PosterTemplate[]>(StorageService.getTemplates());
  const [savedDesigns, setSavedDesigns] = useState<PosterDesign[]>(StorageService.getDesigns());

  // Clipboard for copy & paste
  const clipboardRef = useRef<fabric.Object | null>(null);

  // Update Undo/Redo availability
  const updateHistoryState = useCallback((hm: CanvasHistoryManager) => {
    setCanUndo(hm.canUndo());
    setCanRedo(hm.canRedo());
  }, []);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasElRef.current) return;

    // Create Fabric instance
    const fabricCanvas = new fabric.Canvas(canvasElRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#0f172a',
      preserveObjectStacking: true,
      selection: true,
      fireRightClick: true,
      stopContextMenu: true,
    });

    const hm = new CanvasHistoryManager(fabricCanvas, () => {
      setHasUnsavedChanges(true);
      updateHistoryState(hm);
    });

    // Load initial design or template if provided
    if (initialDesign && initialDesign.designJson) {
      const sanitized = sanitizeDesignJson(initialDesign.designJson);
      fabricCanvas.loadFromJSON(sanitized, () => {
        fabricCanvas.getObjects().forEach((obj: any) => {
          if (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') {
            if (!obj.styles) obj.styles = {};
          }
        });
        fabricCanvas.renderAll();
        hm.reset(sanitized);
        updateHistoryState(hm);
        setHasUnsavedChanges(false);
      });
    } else if (initialTemplate && initialTemplate.designJson) {
      const sanitized = sanitizeDesignJson(initialTemplate.designJson);
      fabricCanvas.loadFromJSON(sanitized, () => {
        fabricCanvas.getObjects().forEach((obj: any) => {
          if (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') {
            if (!obj.styles) obj.styles = {};
          }
        });
        fabricCanvas.renderAll();
        hm.reset(sanitized);
        updateHistoryState(hm);
        setHasUnsavedChanges(true);
      });
    } else {
      hm.saveState();
      updateHistoryState(hm);
    }

    // Event listeners
    const handleSelection = (e: fabric.IEvent) => {
      setSelectedObject(fabricCanvas.getActiveObject() || null);
    };

    const handleClearSelection = () => {
      setSelectedObject(null);
    };

    const handleObjectChange = () => {
      hm.saveState();
      setHasUnsavedChanges(true);
      updateHistoryState(hm);
    };

    fabricCanvas.on('selection:created', handleSelection);
    fabricCanvas.on('selection:updated', handleSelection);
    fabricCanvas.on('selection:cleared', handleClearSelection);
    fabricCanvas.on('object:modified', handleObjectChange);
    fabricCanvas.on('object:added', () => {
      updateHistoryState(hm);
    });
    fabricCanvas.on('object:removed', () => {
      updateHistoryState(hm);
    });

    setCanvas(fabricCanvas);
    setHistoryManager(hm);

    // Initial Zoom Fit
    if (containerRef.current) {
      const containerH = containerRef.current.clientHeight - 80;
      const calculatedZoom = Math.min(0.85, Math.max(0.3, containerH / canvasHeight));
      setZoom(calculatedZoom);
    }

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Keyboard Shortcuts (Undo, Redo, Copy, Paste, Delete, Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is editing inside a text input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (!canvas) return;

      const activeObj = canvas.getActiveObject();
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Ctrl+Z
      if (cmdKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        historyManager?.undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((cmdKey && e.shiftKey && e.key.toLowerCase() === 'z') || (cmdKey && e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        historyManager?.redo();
        return;
      }

      // Save: Ctrl+S
      if (cmdKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
        return;
      }

      // Delete: Delete or Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && activeObj) {
        // If editing text inside fabric textbox, allow standard backspace
        if ((activeObj as any).isEditing) return;
        e.preventDefault();
        canvas.remove(activeObj);
        canvas.discardActiveObject();
        canvas.renderAll();
        historyManager?.saveState();
        return;
      }

      // Copy: Ctrl+C
      if (cmdKey && e.key.toLowerCase() === 'c' && activeObj) {
        e.preventDefault();
        activeObj.clone((cloned: fabric.Object) => {
          clipboardRef.current = cloned;
        });
        return;
      }

      // Paste: Ctrl+V
      if (cmdKey && e.key.toLowerCase() === 'v' && clipboardRef.current) {
        e.preventDefault();
        clipboardRef.current.clone((clonedObj: fabric.Object) => {
          canvas.discardActiveObject();
          clonedObj.set({
            left: (clonedObj.left || 0) + 20,
            top: (clonedObj.top || 0) + 20,
            evented: true,
          });
          if (clonedObj.type === 'activeSelection') {
            clonedObj.canvas = canvas;
            (clonedObj as any).forEachObject((obj: fabric.Object) => {
              canvas.add(obj);
            });
            clonedObj.setCoords();
          } else {
            canvas.add(clonedObj);
          }
          canvas.setActiveObject(clonedObj);
          canvas.renderAll();
          historyManager?.saveState();
        });
        return;
      }

      // Duplicate: Ctrl+D
      if (cmdKey && e.key.toLowerCase() === 'd' && activeObj) {
        e.preventDefault();
        activeObj.clone((cloned: fabric.Object) => {
          cloned.set({
            left: (cloned.left || 0) + 20,
            top: (cloned.top || 0) + 20,
            evented: true,
          });
          canvas.add(cloned);
          canvas.setActiveObject(cloned);
          canvas.renderAll();
          historyManager?.saveState();
        });
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvas, historyManager]);

  // Handle Save Design
  const handleSave = () => {
    if (!canvas) return;
    setIsSaving(true);

    const currentUser = StorageService.getUser();
    const thumbnail = CanvasExportHelpers.generateThumbnail(canvas);
    const designJson = canvas.toJSON(['id', 'name', 'locked', 'selectable', 'evented', 'rx', 'ry']);

    const newDesign: PosterDesign = {
      id: docId,
      userId: currentUser.id,
      title: docTitle || 'Untitled Poster',
      thumbnailUrl: thumbnail,
      canvasWidth,
      canvasHeight,
      dimensionName,
      designJson,
      status: 'draft',
      createdAt: initialDesign?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = StorageService.saveDesign(newDesign);
    setSavedDesigns(StorageService.getDesigns());
    setHasUnsavedChanges(false);
    setIsSaving(false);

    if (onDesignSaved) {
      onDesignSaved(saved);
    }
  };

  // Handle Load Template
  const handleSelectTemplate = (template: PosterTemplate) => {
    if (!canvas) return;
    if (hasUnsavedChanges) {
      if (!window.confirm(`Load "${template.name}"? Unsaved changes in your current design will be replaced.`)) {
        return;
      }
    }

    setDocTitle(template.name);
    setDimensionName(template.dimensionName);
    setCanvasWidth(template.canvasWidth);
    setCanvasHeight(template.canvasHeight);
    canvas.setWidth(template.canvasWidth);
    canvas.setHeight(template.canvasHeight);

    const sanitized = sanitizeDesignJson(template.designJson);
    canvas.loadFromJSON(sanitized, () => {
      canvas.getObjects().forEach((obj: any) => {
        if (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') {
          if (!obj.styles) obj.styles = {};
        }
      });
      canvas.renderAll();
      historyManager?.reset(sanitized);
      if (historyManager) updateHistoryState(historyManager);
      setHasUnsavedChanges(true);
      fitCanvasToScreen();
    });
  };

  // Handle Load Existing Design
  const handleOpenDesign = (design: PosterDesign) => {
    if (!canvas) return;
    if (hasUnsavedChanges) {
      if (!window.confirm(`Open "${design.title}"? Any unsaved edits will be lost.`)) {
        return;
      }
    }

    setDocId(design.id);
    setDocTitle(design.title);
    setDimensionName(design.dimensionName || 'A4 Portrait');
    setCanvasWidth(design.canvasWidth);
    setCanvasHeight(design.canvasHeight);
    canvas.setWidth(design.canvasWidth);
    canvas.setHeight(design.canvasHeight);

    const sanitized = sanitizeDesignJson(design.designJson);
    canvas.loadFromJSON(sanitized, () => {
      canvas.getObjects().forEach((obj: any) => {
        if (obj.type === 'textbox' || obj.type === 'text' || obj.type === 'i-text') {
          if (!obj.styles) obj.styles = {};
        }
      });
      canvas.renderAll();
      historyManager?.reset(sanitized);
      if (historyManager) updateHistoryState(historyManager);
      setHasUnsavedChanges(false);
      fitCanvasToScreen();
    });
  };

  // Fit canvas to viewport
  const fitCanvasToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const isMobile = window.innerWidth < 1024;
    const padding = isMobile ? 24 : 80;
    const containerH = containerRef.current.clientHeight - padding;
    const containerW = containerRef.current.clientWidth - padding;
    const zoomH = containerH / canvasHeight;
    const zoomW = containerW / canvasWidth;
    const bestZoom = Math.min(zoomH, zoomW, 1.0);
    setZoom(Math.max(0.15, parseFloat(bestZoom.toFixed(2))));
  }, [canvasHeight, canvasWidth]);

  // Window resize handler for automatic responsive recalibration
  useEffect(() => {
    const handleResize = () => {
      fitCanvasToScreen();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitCanvasToScreen]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 overflow-hidden font-sans">
      {/* Top Toolbar */}
      <TopToolbar
        canvas={canvas}
        docTitle={docTitle}
        onTitleChange={setDocTitle}
        dimensionName={dimensionName}
        width={canvasWidth}
        height={canvasHeight}
        zoom={zoom}
        onZoomChange={setZoom}
        onFitCanvas={fitCanvasToScreen}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={() => historyManager?.undo()}
        onRedo={() => historyManager?.redo()}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onBack={onBack}
      />

      {/* Main Workspace Area (Left Sidebar + Center Canvas Viewport + Right Properties Sidebar) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbox Drawer */}
        <LeftSidebar
          canvas={canvas}
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
          savedDesigns={savedDesigns}
          onOpenDesign={handleOpenDesign}
          onCanvasModified={() => {
            historyManager?.saveState();
            setHasUnsavedChanges(true);
            if (historyManager) updateHistoryState(historyManager);
          }}
          isOpenMobile={isMobileToolsOpen}
          onCloseMobile={() => setIsMobileToolsOpen(false)}
          activeTabMobile={mobileActiveTab}
          onTabChangeMobile={setMobileActiveTab}
        />

        {/* Center Canvas Viewport */}
        <main
          ref={containerRef}
          className="flex-1 h-full overflow-auto bg-slate-950 flex items-center justify-center p-3 sm:p-8 relative canvas-checkerboard"
        >
          {/* Alignment Grid Overlay if enabled */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-25"
              style={{
                backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />
          )}

          {/* Scaled Canvas Container with drop shadow and clean outline */}
          <div
            className="transition-transform duration-100 ease-out origin-center flex items-center justify-center"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          >
            <div className="relative shadow-2xl rounded-sm ring-1 ring-slate-800/80 bg-slate-900 overflow-hidden">
              <canvas ref={canvasElRef} />
            </div>
          </div>

          {/* Floating Mobile Object Action Pill */}
          {selectedObject && (
            <div className="lg:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-900/95 border border-indigo-500/50 shadow-2xl backdrop-blur-md rounded-full px-3 py-1.5 text-xs text-white">
              <span className="text-[11px] text-indigo-300 font-semibold capitalize max-w-[80px] truncate">
                {selectedObject.type}
              </span>
              <button
                onClick={() => setIsMobilePropsOpen(true)}
                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-[10px] font-semibold cursor-pointer shadow-xs"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (canvas) {
                    canvas.remove(selectedObject);
                    canvas.discardActiveObject();
                    canvas.renderAll();
                    setSelectedObject(null);
                    historyManager?.saveState();
                    setHasUnsavedChanges(true);
                    if (historyManager) updateHistoryState(historyManager);
                  }
                }}
                className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                title="Delete Object"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  if (canvas) {
                    canvas.discardActiveObject();
                    canvas.renderAll();
                    setSelectedObject(null);
                  }
                }}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                title="Deselect"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </main>

        {/* Right Properties Inspector */}
        <RightSidebar
          canvas={canvas}
          selectedObject={selectedObject}
          onCanvasModified={() => {
            historyManager?.saveState();
            setHasUnsavedChanges(true);
            if (historyManager) updateHistoryState(historyManager);
          }}
          isOpenMobile={isMobilePropsOpen}
          onCloseMobile={() => setIsMobilePropsOpen(false)}
        />
      </div>

      {/* Mobile Bottom Navigation Toolbar */}
      <div className="lg:hidden shrink-0 h-14 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 flex items-center justify-around z-30">
        <button
          onClick={() => {
            setMobileActiveTab('templates');
            setIsMobileToolsOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-100 cursor-pointer min-w-[44px]"
        >
          <LayoutTemplate className="w-4 h-4" />
          <span className="text-[10px] font-medium">Templates</span>
        </button>

        <button
          onClick={() => {
            setMobileActiveTab('text');
            setIsMobileToolsOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-100 cursor-pointer min-w-[44px]"
        >
          <Type className="w-4 h-4" />
          <span className="text-[10px] font-medium">Text</span>
        </button>

        <button
          onClick={() => {
            setMobileActiveTab('elements');
            setIsMobileToolsOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-100 cursor-pointer min-w-[44px]"
        >
          <Shapes className="w-4 h-4" />
          <span className="text-[10px] font-medium">Elements</span>
        </button>

        <button
          onClick={() => {
            setMobileActiveTab('uploads');
            setIsMobileToolsOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-100 cursor-pointer min-w-[44px]"
        >
          <Upload className="w-4 h-4" />
          <span className="text-[10px] font-medium">Uploads</span>
        </button>

        <button
          onClick={() => {
            setMobileActiveTab('layers');
            setIsMobileToolsOpen(true);
          }}
          className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-100 cursor-pointer min-w-[44px]"
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] font-medium">Layers</span>
        </button>

        {selectedObject ? (
          <button
            onClick={() => setIsMobilePropsOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-indigo-400 font-semibold cursor-pointer min-w-[44px] bg-indigo-950/60 px-2 py-1 rounded-lg border border-indigo-500/40"
          >
            <Sliders className="w-4 h-4" />
            <span className="text-[10px]">Inspect</span>
          </button>
        ) : (
          <button
            onClick={fitCanvasToScreen}
            className="flex flex-col items-center justify-center gap-0.5 text-slate-400 hover:text-slate-100 cursor-pointer min-w-[44px]"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-[10px] font-medium">Fit</span>
          </button>
        )}
      </div>
    </div>
  );
};
