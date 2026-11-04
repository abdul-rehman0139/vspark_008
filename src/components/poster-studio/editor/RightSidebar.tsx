import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  Copy,
  Trash2,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  ArrowUpToLine,
  ArrowDownToLine,
  FlipHorizontal,
  FlipVertical,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  X
} from 'lucide-react';
import { fabric } from 'fabric';
import { CanvasAlignHelpers } from './fabricUtils';

interface RightSidebarProps {
  canvas: fabric.Canvas | null;
  selectedObject: fabric.Object | null;
  onCanvasModified: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  canvas,
  selectedObject,
  onCanvasModified,
  isOpenMobile,
  onCloseMobile
}) => {
  if (!canvas) return null;

  const isText = selectedObject && (selectedObject.type === 'textbox' || selectedObject.type === 'text' || selectedObject.type === 'i-text');
  const isRect = selectedObject && selectedObject.type === 'rect';
  const isImage = selectedObject && selectedObject.type === 'image';
  const isLocked = selectedObject && (selectedObject.lockMovementX || false);

  // Property handlers
  const updateProp = (key: string, value: any) => {
    if (!selectedObject || !canvas) return;
    selectedObject.set(key as any, value);
    selectedObject.setCoords();
    canvas.renderAll();
    onCanvasModified();
  };

  const handleDuplicate = () => {
    if (!selectedObject || !canvas) return;
    selectedObject.clone((cloned: fabric.Object) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        evented: true,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      onCanvasModified();
    });
  };

  const handleDelete = () => {
    if (!selectedObject || !canvas) return;
    canvas.remove(selectedObject);
    canvas.discardActiveObject();
    canvas.renderAll();
    onCanvasModified();
  };

  const toggleLock = () => {
    if (!selectedObject || !canvas) return;
    const nextLocked = !isLocked;
    selectedObject.set({
      lockMovementX: nextLocked,
      lockMovementY: nextLocked,
      lockRotation: nextLocked,
      lockScalingX: nextLocked,
      lockScalingY: nextLocked,
      hasControls: !nextLocked
    });
    canvas.renderAll();
    onCanvasModified();
  };

  const handleFlip = (dir: 'x' | 'y') => {
    if (!selectedObject || !canvas) return;
    if (dir === 'x') {
      selectedObject.set('flipX', !selectedObject.flipX);
    } else {
      selectedObject.set('flipY', !selectedObject.flipY);
    }
    canvas.renderAll();
    onCanvasModified();
  };

  // Font choices suitable for modern posters
  const fonts = [
    { label: 'Montserrat (Bold)', value: 'Montserrat' },
    { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
    { label: 'Outfit (Modern)', value: 'Outfit' },
    { label: 'Playfair Display (Serif)', value: 'Playfair Display' },
    { label: 'Space Mono (Tech)', value: 'Space Mono' },
    { label: 'Anton (Impact)', value: 'Anton' },
    { label: 'Cinzel (Classical)', value: 'Cinzel' },
    { label: 'Pacifico (Display Script)', value: 'Pacifico' }
  ];

  return (
    <div
      className={`${
        isOpenMobile
          ? 'fixed inset-y-0 right-0 z-50 w-full sm:w-80 flex lg:hidden shadow-2xl animate-fade-in'
          : 'hidden lg:flex w-72'
      } h-full bg-slate-900 border-l border-slate-800 text-slate-200 select-none z-10 shrink-0 overflow-y-auto flex-col`}
    >
      {/* On mobile: Backdrop to close */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs -z-10"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Top Header with Close Button */}
      <div className="flex lg:hidden items-center justify-between p-3.5 bg-slate-950 border-b border-slate-800 sticky top-0 z-20 shrink-0">
        <span className="font-semibold text-sm text-slate-100">
          {selectedObject ? `${selectedObject.type?.toUpperCase()} Inspector` : 'Canvas Settings'}
        </span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 flex-1">
      {/* If nothing selected: Canvas properties */}
      {!selectedObject ? (
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100">Canvas Settings</h3>
            <p className="text-xs text-slate-400">Click any element on canvas to inspect and edit its properties.</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">Dimensions</label>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 flex justify-between">
              <span>Width: {canvas.getWidth()} px</span>
              <span>Height: {canvas.getHeight()} px</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-slate-400">Background Tone</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={typeof canvas.backgroundColor === 'string' ? canvas.backgroundColor : '#0f172a'}
                onChange={(e) => {
                  canvas.setBackgroundColor(e.target.value, () => {
                    canvas.renderAll();
                    onCanvasModified();
                  });
                }}
                className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300">
                {typeof canvas.backgroundColor === 'string' ? canvas.backgroundColor : '#0f172a'}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the canvas?')) {
                  canvas.clear();
                  canvas.setBackgroundColor('#0f172a', () => canvas.renderAll());
                  onCanvasModified();
                }
              }}
              className="w-full py-2 px-3 text-xs font-medium text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
            >
              Clear Entire Canvas
            </button>
          </div>
        </div>
      ) : (
        /* Element selected: Inspector Controls */
        <div className="space-y-4">
          {/* Top Quick Actions Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-200 capitalize">
              {selectedObject.type === 'textbox' ? 'Text Element' : `${selectedObject.type} Properties`}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleLock}
                className={`p-1.5 rounded hover:bg-slate-800 transition-colors ${isLocked ? 'text-amber-400' : 'text-slate-400'}`}
                title={isLocked ? 'Unlock Element' : 'Lock Element'}
              >
                {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDuplicate}
                className="p-1.5 rounded text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                title="Delete (Del)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TEXT SPECIFIC CONTROLS */}
          {isText && (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Font Family
                </label>
                <select
                  value={(selectedObject as any).fontFamily || 'Montserrat'}
                  onChange={(e) => updateProp('fontFamily', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {fonts.map((f) => (
                    <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Size (px)
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={200}
                    value={(selectedObject as any).fontSize || 24}
                    onChange={(e) => updateProp('fontSize', parseInt(e.target.value) || 16)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Weight
                  </label>
                  <select
                    value={(selectedObject as any).fontWeight || 'normal'}
                    onChange={(e) => updateProp('fontWeight', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="normal">Regular (400)</option>
                    <option value="600">SemiBold (600)</option>
                    <option value="bold">Bold (700)</option>
                    <option value="900">Black (900)</option>
                  </select>
                </div>
              </div>

              {/* Text Styles & Alignments */}
              <div className="flex items-center justify-between bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => {
                    const current = (selectedObject as any).fontStyle;
                    updateProp('fontStyle', current === 'italic' ? 'normal' : 'italic');
                  }}
                  className={`p-1.5 rounded ${(selectedObject as any).fontStyle === 'italic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const current = (selectedObject as any).underline;
                    updateProp('underline', !current);
                  }}
                  className={`p-1.5 rounded ${(selectedObject as any).underline ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Underline"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    const current = (selectedObject as any).linethrough;
                    updateProp('linethrough', !current);
                  }}
                  className={`p-1.5 rounded ${(selectedObject as any).linethrough ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Strikethrough"
                >
                  <Strikethrough className="w-3.5 h-3.5" />
                </button>

                <div className="h-4 w-[1px] bg-slate-800" />

                <button
                  onClick={() => updateProp('textAlign', 'left')}
                  className={`p-1.5 rounded ${(selectedObject as any).textAlign === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateProp('textAlign', 'center')}
                  className={`p-1.5 rounded ${(selectedObject as any).textAlign === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateProp('textAlign', 'right')}
                  className={`p-1.5 rounded ${(selectedObject as any).textAlign === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Text Color */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Text Fill Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={typeof selectedObject.fill === 'string' ? selectedObject.fill : '#ffffff'}
                    onChange={(e) => updateProp('fill', e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={typeof selectedObject.fill === 'string' ? selectedObject.fill : '#ffffff'}
                    onChange={(e) => updateProp('fill', e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Line Height & Letter Spacing */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Line Height
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    max="3"
                    value={(selectedObject as any).lineHeight || 1.2}
                    onChange={(e) => updateProp('lineHeight', parseFloat(e.target.value) || 1.2)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Letter Space
                  </label>
                  <input
                    type="number"
                    step="10"
                    min="-50"
                    max="500"
                    value={(selectedObject as any).charSpacing || 0}
                    onChange={(e) => updateProp('charSpacing', parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SHAPE OR GENERAL OBJECT PROPERTIES */}
          {!isText && !isImage && (
            <div className="space-y-3">
              {/* Fill Color */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Fill Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={typeof selectedObject.fill === 'string' ? selectedObject.fill : '#4f46e5'}
                    onChange={(e) => updateProp('fill', e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={typeof selectedObject.fill === 'string' ? selectedObject.fill : '#4f46e5'}
                    onChange={(e) => updateProp('fill', e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Stroke */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Border / Stroke
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={typeof selectedObject.stroke === 'string' ? selectedObject.stroke : '#ffffff'}
                    onChange={(e) => updateProp('stroke', e.target.value)}
                    className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                  />
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={selectedObject.strokeWidth || 0}
                    onChange={(e) => updateProp('strokeWidth', parseInt(e.target.value) || 0)}
                    placeholder="Width px"
                    className="w-20 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-slate-200 font-mono"
                  />
                </div>
              </div>

              {/* Rounded Corners (for rects) */}
              {isRect && (
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Corner Radius: {(selectedObject as any).rx || 0}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={(selectedObject as any).rx || 0}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      updateProp('rx', val);
                      updateProp('ry', val);
                    }}
                    className="w-full accent-indigo-500"
                  />
                </div>
              )}
            </div>
          )}

          {/* COMMON TRANSFORM & OPACITY */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            {/* Opacity */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Opacity
                </label>
                <span className="text-xs font-mono text-slate-300">
                  {Math.round((selectedObject.opacity || 1) * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={selectedObject.opacity !== undefined ? selectedObject.opacity : 1}
                onChange={(e) => updateProp('opacity', parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Flip */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Flip Element
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFlip('x')}
                  className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded flex items-center justify-center gap-1.5 text-xs text-slate-300 cursor-pointer"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" /> Flip Horiz
                </button>
                <button
                  onClick={() => handleFlip('y')}
                  className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded flex items-center justify-center gap-1.5 text-xs text-slate-300 cursor-pointer"
                >
                  <FlipVertical className="w-3.5 h-3.5" /> Flip Vert
                </button>
              </div>
            </div>

            {/* Smart Alignment to Canvas */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Align to Canvas
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                <button
                  onClick={() => CanvasAlignHelpers.align(canvas, 'left')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white flex justify-center"
                  title="Align Left"
                >
                  <AlignStartVertical className="w-4 h-4" />
                </button>
                <button
                  onClick={() => CanvasAlignHelpers.align(canvas, 'center-h')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white flex justify-center"
                  title="Align Center Horizontal"
                >
                  <AlignCenterVertical className="w-4 h-4" />
                </button>
                <button
                  onClick={() => CanvasAlignHelpers.align(canvas, 'right')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white flex justify-center"
                  title="Align Right"
                >
                  <AlignEndVertical className="w-4 h-4" />
                </button>

                <button
                  onClick={() => CanvasAlignHelpers.align(canvas, 'top')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white flex justify-center"
                  title="Align Top"
                >
                  <AlignStartHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => CanvasAlignHelpers.align(canvas, 'middle-v')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white flex justify-center"
                  title="Align Middle Vertical"
                >
                  <AlignCenterHorizontal className="w-4 h-4" />
                </button>
                <button
                  onClick={() => CanvasAlignHelpers.align(canvas, 'bottom')}
                  className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white flex justify-center"
                  title="Align Bottom"
                >
                  <AlignEndHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Layer Arrange */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Arrange Layer
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    selectedObject.bringForward();
                    canvas.renderAll();
                    onCanvasModified();
                  }}
                  className="py-1 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded flex items-center justify-center gap-1 text-[11px] text-slate-300 cursor-pointer"
                >
                  <MoveUp className="w-3.5 h-3.5" /> Forward
                </button>
                <button
                  onClick={() => {
                    selectedObject.sendBackwards();
                    canvas.renderAll();
                    onCanvasModified();
                  }}
                  className="py-1 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded flex items-center justify-center gap-1 text-[11px] text-slate-300 cursor-pointer"
                >
                  <MoveDown className="w-3.5 h-3.5" /> Backward
                </button>
                <button
                  onClick={() => {
                    selectedObject.bringToFront();
                    canvas.renderAll();
                    onCanvasModified();
                  }}
                  className="py-1 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded flex items-center justify-center gap-1 text-[11px] text-slate-300 cursor-pointer"
                >
                  <ArrowUpToLine className="w-3.5 h-3.5" /> To Front
                </button>
                <button
                  onClick={() => {
                    selectedObject.sendToBack();
                    canvas.renderAll();
                    onCanvasModified();
                  }}
                  className="py-1 px-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded flex items-center justify-center gap-1 text-[11px] text-slate-300 cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" /> To Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
