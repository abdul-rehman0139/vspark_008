import { fabric } from 'fabric';
import jsPDF from 'jspdf';

// Customizing default fabric selection styling for sleek modern Figma/Canva appearance
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = '#4f46e5';
fabric.Object.prototype.cornerStrokeColor = '#ffffff';
fabric.Object.prototype.borderColor = '#6366f1';
fabric.Object.prototype.cornerSize = 10;
fabric.Object.prototype.cornerStyle = 'circle';
fabric.Object.prototype.borderScaleFactor = 2;
fabric.Object.prototype.borderDashArray = [4, 4];

// Defensive patch for Fabric.js bug: stylesToArray throws Cannot read properties of undefined (reading '0')
// when text object styles are missing, null, or undefined.
if (fabric.util) {
  const originalStylesToArray = (fabric.util as any).stylesToArray;
  (fabric.util as any).stylesToArray = function (styles: any, text: string) {
    if (!styles || typeof styles !== 'object') {
      return [];
    }
    try {
      if (typeof originalStylesToArray === 'function') {
        return originalStylesToArray.call(this, styles, text || '');
      }
      return [];
    } catch (e) {
      return [];
    }
  };
}

// Ensure Textbox, IText, and Text instances always have initialized styles before serialization
if (fabric.Textbox && fabric.Textbox.prototype) {
  const originalTextboxToObject = fabric.Textbox.prototype.toObject;
  fabric.Textbox.prototype.toObject = function (propertiesToInclude?: string[]) {
    if (!this.styles || typeof this.styles !== 'object') {
      this.styles = {};
    }
    try {
      return originalTextboxToObject.call(this, propertiesToInclude);
    } catch (e) {
      // Fallback if serialization fails
      const fallback = (fabric.Object.prototype.toObject as any).call(this, propertiesToInclude);
      fallback.text = this.text;
      fallback.fontSize = this.fontSize;
      fallback.fontFamily = this.fontFamily;
      fallback.fontWeight = this.fontWeight;
      fallback.fill = this.fill;
      fallback.textAlign = this.textAlign;
      fallback.styles = [];
      return fallback;
    }
  };
}

if (fabric.IText && fabric.IText.prototype) {
  const originalITextToObject = fabric.IText.prototype.toObject;
  fabric.IText.prototype.toObject = function (propertiesToInclude?: string[]) {
    if (!this.styles || typeof this.styles !== 'object') {
      this.styles = {};
    }
    try {
      return originalITextToObject.call(this, propertiesToInclude);
    } catch (e) {
      const fallback = (fabric.Object.prototype.toObject as any).call(this, propertiesToInclude);
      fallback.text = this.text;
      fallback.styles = [];
      return fallback;
    }
  };
}

if (fabric.Text && fabric.Text.prototype) {
  const originalTextToObject = fabric.Text.prototype.toObject;
  fabric.Text.prototype.toObject = function (propertiesToInclude?: string[]) {
    if (!this.styles || typeof this.styles !== 'object') {
      this.styles = {};
    }
    try {
      return originalTextToObject.call(this, propertiesToInclude);
    } catch (e) {
      const fallback = (fabric.Object.prototype.toObject as any).call(this, propertiesToInclude);
      fallback.text = this.text;
      fallback.styles = [];
      return fallback;
    }
  };
}

export class CanvasHistoryManager {
  private canvas: fabric.Canvas;
  private history: string[] = [];
  private historyIndex: number = -1;
  private isProcessing: boolean = false;
  private onChangeCallback?: () => void;

  constructor(canvas: fabric.Canvas, onChange?: () => void) {
    this.canvas = canvas;
    this.onChangeCallback = onChange;
  }

  public saveState() {
    if (this.isProcessing) return;
    const json = JSON.stringify(this.canvas.toJSON([
      'id', 'name', 'locked', 'selectable', 'evented', 'rx', 'ry'
    ]));
    
    // If we're not at the end of the history array, trim future states
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // Don't duplicate if unchanged
    if (this.history.length > 0 && this.history[this.historyIndex] === json) {
      return;
    }

    this.history.push(json);
    if (this.history.length > 30) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
  }

  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  public canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  public undo() {
    if (!this.canUndo()) return;
    this.isProcessing = true;
    this.historyIndex--;
    const state = this.history[this.historyIndex];
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
      this.isProcessing = false;
      if (this.onChangeCallback) this.onChangeCallback();
    });
  }

  public redo() {
    if (!this.canRedo()) return;
    this.isProcessing = true;
    this.historyIndex++;
    const state = this.history[this.historyIndex];
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll();
      this.isProcessing = false;
      if (this.onChangeCallback) this.onChangeCallback();
    });
  }

  public reset(initialJson?: any) {
    this.history = [];
    this.historyIndex = -1;
    if (initialJson) {
      this.history.push(typeof initialJson === 'string' ? initialJson : JSON.stringify(initialJson));
      this.historyIndex = 0;
    }
  }
}

// Element creation helpers
export const CanvasAddHelpers = {
  addHeading(canvas: fabric.Canvas, text = 'Add Heading', options: Partial<fabric.ITextboxOptions> = {}) {
    const center = canvas.getCenter();
    const textbox = new fabric.Textbox(text, {
      left: center.left - 180,
      top: center.top - 40,
      width: 360,
      fontSize: 48,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      ...options
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    return textbox;
  },

  addSubheading(canvas: fabric.Canvas, text = 'Add Subheading', options: Partial<fabric.ITextboxOptions> = {}) {
    const center = canvas.getCenter();
    const textbox = new fabric.Textbox(text, {
      left: center.left - 150,
      top: center.top - 20,
      width: 300,
      fontSize: 24,
      fontFamily: 'Outfit',
      fontWeight: '600',
      fill: '#94a3b8',
      textAlign: 'center',
      ...options
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    return textbox;
  },

  addParagraph(canvas: fabric.Canvas, text = 'Type your event description or details here. Customize fonts, colors, and alignments easily in the properties panel.', options: Partial<fabric.ITextboxOptions> = {}) {
    const center = canvas.getCenter();
    const textbox = new fabric.Textbox(text, {
      left: center.left - 160,
      top: center.top - 30,
      width: 320,
      fontSize: 16,
      fontFamily: 'Plus Jakarta Sans',
      fill: '#cbd5e1',
      textAlign: 'left',
      lineHeight: 1.5,
      ...options
    });
    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    return textbox;
  },

  addRect(canvas: fabric.Canvas, options: Partial<fabric.IRectOptions> = {}) {
    const center = canvas.getCenter();
    const rect = new fabric.Rect({
      left: center.left - 100,
      top: center.top - 80,
      width: 200,
      height: 160,
      fill: '#4f46e5',
      rx: 8,
      ry: 8,
      ...options
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    return rect;
  },

  addCircle(canvas: fabric.Canvas, options: Partial<fabric.ICircleOptions> = {}) {
    const center = canvas.getCenter();
    const circle = new fabric.Circle({
      left: center.left - 80,
      top: center.top - 80,
      radius: 80,
      fill: '#06b6d4',
      ...options
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    return circle;
  },

  addTriangle(canvas: fabric.Canvas, options: Partial<fabric.ITriangleOptions> = {}) {
    const center = canvas.getCenter();
    const triangle = new fabric.Triangle({
      left: center.left - 80,
      top: center.top - 80,
      width: 160,
      height: 140,
      fill: '#f59e0b',
      ...options
    });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
    return triangle;
  },

  addLine(canvas: fabric.Canvas, options: Partial<fabric.ILineOptions> = {}) {
    const center = canvas.getCenter();
    const line = new fabric.Line([center.left - 120, center.top, center.left + 120, center.top], {
      stroke: '#e2e8f0',
      strokeWidth: 3,
      ...options
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
    return line;
  },

  addStar(canvas: fabric.Canvas) {
    const center = canvas.getCenter();
    // 5-point star path
    const starPath = 'M 0,-50 L 14,-15 L 50,-15 L 20,8 L 32,45 L 0,22 L -32,45 L -20,8 L -50,-15 L -14,-15 Z';
    const path = new fabric.Path(starPath, {
      left: center.left - 50,
      top: center.top - 50,
      fill: '#facc15',
      scaleX: 1.5,
      scaleY: 1.5
    });
    canvas.add(path);
    canvas.setActiveObject(path);
    canvas.renderAll();
    return path;
  },

  addBadge(canvas: fabric.Canvas, text = 'REGISTRATION OPEN') {
    const center = canvas.getCenter();
    const rect = new fabric.Rect({
      width: 240,
      height: 38,
      fill: '#4338ca',
      rx: 19,
      ry: 19,
      originX: 'center',
      originY: 'center'
    });
    const label = new fabric.Text(text, {
      fontSize: 13,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fill: '#e0e7ff',
      originX: 'center',
      originY: 'center',
      charSpacing: 100
    });
    const group = new fabric.Group([rect, label], {
      left: center.left - 120,
      top: center.top - 20
    });
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    return group;
  },

  addImageFromUrl(canvas: fabric.Canvas, url: string, callback?: (img: fabric.Image) => void) {
    fabric.Image.fromURL(url, (img) => {
      if (!img) return;
      const center = canvas.getCenter();
      
      // Auto-scale if larger than canvas
      const maxW = canvas.getWidth() * 0.7;
      const maxH = canvas.getHeight() * 0.7;
      let scale = 1;
      if (img.width && img.width > maxW) {
        scale = maxW / img.width;
      }
      if (img.height && img.height * scale > maxH) {
        scale = maxH / img.height;
      }

      img.set({
        left: center.left - ((img.width || 200) * scale) / 2,
        top: center.top - ((img.height || 200) * scale) / 2,
        scaleX: scale,
        scaleY: scale
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
      if (callback) callback(img);
    }, { crossOrigin: 'anonymous' });
  }
};

// Alignment Utilities
export const CanvasAlignHelpers = {
  align(canvas: fabric.Canvas, type: 'left' | 'center-h' | 'right' | 'top' | 'middle-v' | 'bottom') {
    const active = canvas.getActiveObject();
    if (!active) return;
    const cWidth = canvas.getWidth();
    const cHeight = canvas.getHeight();
    const b = active.getBoundingRect();

    switch (type) {
      case 'left':
        active.set({ left: (active.left || 0) - b.left });
        break;
      case 'center-h':
        active.set({ left: (active.left || 0) + (cWidth / 2 - (b.left + b.width / 2)) });
        break;
      case 'right':
        active.set({ left: (active.left || 0) + (cWidth - (b.left + b.width)) });
        break;
      case 'top':
        active.set({ top: (active.top || 0) - b.top });
        break;
      case 'middle-v':
        active.set({ top: (active.top || 0) + (cHeight / 2 - (b.top + b.height / 2)) });
        break;
      case 'bottom':
        active.set({ top: (active.top || 0) + (cHeight - (b.top + b.height)) });
        break;
    }
    active.setCoords();
    canvas.renderAll();
  }
};

// Export Utilities
export const CanvasExportHelpers = {
  downloadPNG(canvas: fabric.Canvas, filename = 'vspark-poster.png', multiplier = 2, transparent = false) {
    const originalBg = canvas.backgroundColor;
    if (transparent) {
      canvas.setBackgroundColor('', () => {});
    }

    const dataUrl = canvas.toDataURL({
      format: 'png',
      multiplier: multiplier,
      quality: 1
    });

    if (transparent && originalBg) {
      canvas.setBackgroundColor(originalBg, () => {});
    }

    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadJPG(canvas: fabric.Canvas, filename = 'vspark-poster.jpg', multiplier = 2, quality = 0.95) {
    const dataUrl = canvas.toDataURL({
      format: 'jpeg',
      multiplier: multiplier,
      quality: quality
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.jpg') ? filename : `${filename}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadPDF(canvas: fabric.Canvas, filename = 'vspark-poster.pdf', docTitle = 'VSpark Poster') {
    const width = canvas.getWidth();
    const height = canvas.getHeight();
    const isLandscape = width > height;

    // Standard portrait or landscape jsPDF document
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height],
      hotfixes: ['px_scaling']
    });

    const imgData = canvas.toDataURL({
      format: 'png',
      multiplier: 2,
      quality: 1
    });

    pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
    pdf.setProperties({
      title: docTitle,
      subject: 'VSpark Poster Studio Design',
      creator: 'VSpark Poster Studio'
    });
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  },

  generateThumbnail(canvas: fabric.Canvas): string {
    return canvas.toDataURL({
      format: 'jpeg',
      multiplier: 0.35,
      quality: 0.7
    });
  }
};
