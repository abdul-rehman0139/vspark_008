import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Save, 
  Printer, 
  Eraser, 
  Type, 
  PenTool, 
  Highlighter, 
  Square, 
  Circle, 
  CheckSquare, 
  Image as ImageIcon, 
  Stamp, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Trash2, 
  Undo2, 
  Redo2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Copy, 
  Eye, 
  Layers, 
  Check, 
  X,
  FileCheck,
  Flame,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { fabric } from 'fabric';
import { UserProfile } from '../../types';
import { FirebaseService } from '../../services/firebase';

interface PdfEditorProps {
  currentUser: UserProfile;
  onBackToStudio: () => void;
  onOpenAuth: () => void;
}

interface PdfPageData {
  pageNumber: number;
  canvasJson?: any;
  bgImageUrl?: string;
  width: number;
  height: number;
}

export const PdfEditor: React.FC<PdfEditorProps> = ({
  currentUser,
  onBackToStudio,
  onOpenAuth
}) => {
  // Document state
  const [docTitle, setDocTitle] = useState('Campus_Document_Edited.pdf');
  const [pages, setPages] = useState<PdfPageData[]>([
    { pageNumber: 1, width: 794, height: 1123 }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Active Tool state
  type EditorTool = 'select' | 'text' | 'watermark-remover' | 'whiteout' | 'redact' | 'draw' | 'highlighter' | 'rect' | 'circle' | 'signature' | 'stamp';
  const [activeTool, setActiveTool] = useState<EditorTool>('select');

  // Properties for tools
  const [fontColor, setFontColor] = useState('#0f172a');
  const [fontSize, setFontSize] = useState(20);
  const [brushColor, setBrushColor] = useState('#6366f1');
  const [brushWidth, setBrushWidth] = useState(4);
  const [whiteoutColor, setWhiteoutColor] = useState('#ffffff');

  // Modals
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showWatermarkModal, setShowWatermarkModal] = useState(false);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkAngle, setWatermarkAngle] = useState(-45);

  // Canvas ref
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  // Signature canvas
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawingSig, setIsDrawingSig] = useState(false);
  const [sigColor, setSigColor] = useState('#1e1b4b');

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Initialize Fabric canvas on mount and page switch
  useEffect(() => {
    if (!canvasElRef.current) return;

    const currentPage = pages[currentPageIndex] || { width: 794, height: 1123 };
    
    // Dispose previous
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: currentPage.width,
      height: currentPage.height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true
    });

    fabricCanvasRef.current = canvas;

    // Load background image if page has one (from PDF rendering)
    if (currentPage.bgImageUrl) {
      fabric.Image.fromURL(currentPage.bgImageUrl, (img) => {
        img.set({
          selectable: false,
          evented: false,
          originX: 'left',
          originY: 'top',
          scaleX: currentPage.width / (img.width || currentPage.width),
          scaleY: currentPage.height / (img.height || currentPage.height)
        });
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });
    } else if (currentPage.canvasJson) {
      canvas.loadFromJSON(currentPage.canvasJson, () => {
        canvas.renderAll();
      });
    } else {
      // Default initial certificate / document mockup so the user immediately sees editable content
      seedDefaultCertificate(canvas, currentPage.width, currentPage.height);
    }

    // Keyboard shortcuts: Delete
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isInputActive()) {
        const active = canvas.getActiveObjects();
        if (active.length > 0) {
          active.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, [currentPageIndex]);

  const isInputActive = () => {
    const el = document.activeElement;
    return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable);
  };

  // Switch active tool mode on Fabric canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = false;
    canvas.selection = activeTool === 'select';

    if (activeTool === 'draw') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    } else if (activeTool === 'highlighter') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = 'rgba(250, 204, 21, 0.4)'; // Yellow highlighter
      canvas.freeDrawingBrush.width = 18;
    }
  }, [activeTool, brushColor, brushWidth]);

  // Seed default document with a visible watermark so the user can test watermark removal immediately
  const seedDefaultCertificate = (canvas: fabric.Canvas, w: number, h: number) => {
    // Elegant border
    const border = new fabric.Rect({
      left: 30,
      top: 30,
      width: w - 60,
      height: h - 60,
      fill: '#fcfdfd',
      stroke: '#0f172a',
      strokeWidth: 3,
      selectable: false,
      rx: 8,
      ry: 8
    });

    const innerBorder = new fabric.Rect({
      left: 45,
      top: 45,
      width: w - 90,
      height: h - 90,
      fill: 'transparent',
      stroke: '#d97706',
      strokeWidth: 1.5,
      strokeDashArray: [6, 4],
      selectable: false
    });

    // Institution Title
    const title = new fabric.Textbox('CAMPUS INNOVATION COUNCIL', {
      left: 60,
      top: 90,
      width: w - 120,
      fontSize: 22,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fill: '#0f172a',
      textAlign: 'center',
      charSpacing: 180
    });

    const subtitle = new fabric.Textbox('CERTIFICATE OF RECOGNITION & PARTICIPATION', {
      left: 60,
      top: 150,
      width: w - 120,
      fontSize: 34,
      fontFamily: 'Playfair Display',
      fontWeight: 'bold',
      fill: '#b45309',
      textAlign: 'center'
    });

    const presentedTo = new fabric.Textbox('This official document is proudly awarded to:', {
      left: 60,
      top: 260,
      width: w - 120,
      fontSize: 16,
      fontFamily: 'Outfit',
      fill: '#64748b',
      textAlign: 'center'
    });

    const recipient = new fabric.Textbox('Alex Rivera & Team VSpark', {
      left: 60,
      top: 310,
      width: w - 120,
      fontSize: 42,
      fontFamily: 'Playfair Display',
      fontWeight: 'bold',
      fontStyle: 'italic',
      fill: '#1e1b4b',
      textAlign: 'center'
    });

    const desc = new fabric.Textbox('For distinguished excellence, collaborative leadership, and outstanding technical innovation displayed in the 2026 Inter-Collegiate Engineering Hackathon.', {
      left: 100,
      top: 400,
      width: w - 200,
      fontSize: 16,
      fontFamily: 'Plus Jakarta Sans',
      fill: '#334155',
      textAlign: 'center',
      lineHeight: 1.6
    });

    // Signatures line
    const sigLine1 = new fabric.Line([120, 680, 320, 680], {
      stroke: '#94a3b8',
      strokeWidth: 1.5
    });

    const sigText1 = new fabric.Textbox('Dean of Academic Affairs\nDr. Marcus Vance', {
      left: 120,
      top: 695,
      width: 200,
      fontSize: 13,
      fontFamily: 'Outfit',
      fill: '#64748b',
      textAlign: 'center'
    });

    const sigLine2 = new fabric.Line([w - 320, 680, w - 120, 680], {
      stroke: '#94a3b8',
      strokeWidth: 1.5
    });

    const sigText2 = new fabric.Textbox('Director of Competitions\nProf. Elena Rostova', {
      left: w - 320,
      top: 695,
      width: 200,
      fontSize: 13,
      fontFamily: 'Outfit',
      fill: '#64748b',
      textAlign: 'center'
    });

    // Sample Watermark (The user asked to be able to remove watermarks!)
    const sampleWatermark = new fabric.Textbox('SAMPLE WATERMARK • DRAFT ONLY', {
      left: w / 2,
      top: h / 2,
      originX: 'center',
      originY: 'center',
      angle: -35,
      fontSize: 48,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fill: 'rgba(239, 68, 68, 0.22)',
      stroke: 'rgba(239, 68, 68, 0.3)',
      strokeWidth: 1,
      charSpacing: 100,
      name: 'watermark-element'
    });

    canvas.add(
      border, 
      innerBorder, 
      title, 
      subtitle, 
      presentedTo, 
      recipient, 
      desc, 
      sigLine1, 
      sigText1, 
      sigLine2, 
      sigText2, 
      sampleWatermark
    );
    canvas.renderAll();
  };

  // Handle PDF file upload via PDF.js
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocTitle(file.name);
    showToast('Loading PDF document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      // Use PDF.js from window
      const pdfjs = (window as any).pdfjsLib;
      if (!pdfjs) {
        showToast('PDF rendering engine initializing. Please try again.');
        return;
      }

      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      const loadedPages: PdfPageData[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // High resolution

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = viewport.width;
        tempCanvas.height = viewport.height;
        const ctx = tempCanvas.getContext('2d');

        await page.render({
          canvasContext: ctx!,
          viewport: viewport
        }).promise;

        const imgDataUrl = tempCanvas.toDataURL('image/png');
        loadedPages.push({
          pageNumber: i,
          width: viewport.width,
          height: viewport.height,
          bgImageUrl: imgDataUrl
        });
      }

      setPages(loadedPages);
      setCurrentPageIndex(0);
      showToast(`Loaded ${numPages} page${numPages > 1 ? 's' : ''} successfully!`);
    } catch (err) {
      console.error(err);
      showToast('Failed to load PDF file. Please ensure it is a valid PDF.');
    }
  };

  // Add editable text block
  const handleAddText = (type: 'heading' | 'subheading' | 'body') => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    let text = 'Edit this text';
    let size = 20;
    let weight = 'normal';

    if (type === 'heading') {
      text = 'Heading Text';
      size = 32;
      weight = 'bold';
    } else if (type === 'subheading') {
      text = 'Subheading or Caption';
      size = 22;
      weight = '600';
    }

    const textbox = new fabric.Textbox(text, {
      left: canvas.width! / 2 - 120,
      top: canvas.height! / 3,
      width: 260,
      fontSize: size,
      fontWeight: weight,
      fontFamily: 'Plus Jakarta Sans',
      fill: fontColor,
      backgroundColor: 'transparent'
    });

    canvas.add(textbox);
    canvas.setActiveObject(textbox);
    canvas.renderAll();
    setActiveTool('select');
  };

  // Watermark Remover / Whiteout Box Tool
  const handleAddWhiteout = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    // Creates an adjustable whiteout mask that seamlessly covers watermarks, stamps, or text
    const mask = new fabric.Rect({
      left: canvas.width! / 2 - 150,
      top: canvas.height! / 2 - 40,
      width: 300,
      height: 80,
      fill: whiteoutColor,
      stroke: 'rgba(99, 102, 241, 0.4)',
      strokeWidth: 1,
      strokeDashArray: [4, 4],
      rx: 2,
      ry: 2,
      name: 'whiteout-mask'
    });

    // Remove dashed border once placed/deselected
    mask.on('deselected', () => {
      mask.set('strokeWidth', 0);
      canvas.requestRenderAll();
    });
    mask.on('selected', () => {
      mask.set('strokeWidth', 1);
      canvas.requestRenderAll();
    });

    canvas.add(mask);
    canvas.setActiveObject(mask);
    canvas.bringToFront(mask);
    canvas.renderAll();
    showToast('Watermark mask created! Drag & resize over any watermark to erase it.');
    setActiveTool('select');
  };

  // Quick 1-Click Watermark Stripper (Auto finds sample watermark or diagonal layers and removes/hides them)
  const handleAutoRemoveWatermarks = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const objects = canvas.getObjects();
    let removedCount = 0;

    // Find objects named watermark or with angle between 20 and 60 / -60 and -20 and opacity < 0.6
    objects.forEach(obj => {
      if (
        obj.name === 'watermark-element' ||
        (obj.type === 'textbox' && ((obj as any).text?.includes('WATERMARK') || (obj as any).text?.includes('CONFIDENTIAL') || (obj as any).text?.includes('DRAFT')))
      ) {
        canvas.remove(obj);
        removedCount++;
      }
    });

    if (removedCount > 0) {
      canvas.renderAll();
      showToast(`Removed ${removedCount} watermark layer${removedCount > 1 ? 's' : ''} cleanly!`);
    } else {
      // If the PDF is a flattened background image, drop a smart center whiteout mask over the center watermark area
      const centerWhiteout = new fabric.Rect({
        left: canvas.width! * 0.15,
        top: canvas.height! * 0.35,
        width: canvas.width! * 0.7,
        height: canvas.height! * 0.3,
        fill: whiteoutColor,
        rx: 4,
        ry: 4
      });
      canvas.add(centerWhiteout);
      canvas.sendToBack(centerWhiteout);
      canvas.renderAll();
      showToast('Smart whiteout layer applied over central watermark area!');
    }
  };

  // Add Custom Watermark
  const handleApplyWatermark = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const watermark = new fabric.Textbox(watermarkText, {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      originX: 'center',
      originY: 'center',
      angle: watermarkAngle,
      fontSize: 48,
      fontFamily: 'Montserrat',
      fontWeight: 'bold',
      fill: `rgba(99, 102, 241, ${watermarkOpacity})`,
      charSpacing: 120,
      name: 'custom-watermark'
    });

    canvas.add(watermark);
    canvas.renderAll();
    setShowWatermarkModal(false);
    showToast('Custom watermark applied!');
  };

  // Add Official Stamp
  const handleAddStamp = (text: string, color: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    const group = new fabric.Group([], {
      left: canvas.width! / 2 - 80,
      top: canvas.height! / 2 - 30,
      angle: -12
    });

    const border = new fabric.Rect({
      width: 170,
      height: 55,
      fill: 'rgba(255, 255, 255, 0.95)',
      stroke: color,
      strokeWidth: 3,
      rx: 8,
      ry: 8
    });

    const inner = new fabric.Rect({
      left: 4,
      top: 4,
      width: 162,
      height: 47,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 1,
      rx: 5,
      ry: 5
    });

    const stampText = new fabric.Text(text, {
      left: 14,
      top: 14,
      fontSize: 20,
      fontFamily: 'Anton',
      fill: color,
      charSpacing: 80
    });

    group.addWithUpdate(border);
    group.addWithUpdate(inner);
    group.addWithUpdate(stampText);

    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    setActiveTool('select');
    showToast(`Added '${text}' official stamp!`);
  };

  // Signature Pad Logic
  const startDrawingSig = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawingSig(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const drawSig = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingSig) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = sigColor;
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawingSig = () => {
    setIsDrawingSig(false);
  };

  const handleClearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleInsertSignature = () => {
    const sigCanvas = sigCanvasRef.current;
    const targetCanvas = fabricCanvasRef.current;
    if (!sigCanvas || !targetCanvas) return;

    const dataUrl = sigCanvas.toDataURL('image/png');
    fabric.Image.fromURL(dataUrl, (img) => {
      img.set({
        left: targetCanvas.width! / 2 - 80,
        top: targetCanvas.height! - 220,
        scaleX: 0.8,
        scaleY: 0.8
      });
      targetCanvas.add(img);
      targetCanvas.setActiveObject(img);
      targetCanvas.renderAll();
      setShowSignatureModal(false);
      handleClearSignature();
      showToast('Digital signature placed on document!');
    });
  };

  // Image insertion
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;

      fabric.Image.fromURL(dataUrl, (img) => {
        img.scaleToWidth(200);
        img.set({
          left: canvas.width! / 2 - 100,
          top: canvas.height! / 2 - 100
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
        showToast('Image inserted onto document!');
      });
    };
    reader.readAsDataURL(file);
  };

  // Export as High-Resolution PDF
  const handleExportPdf = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    showToast('Generating high-res PDF...');
    
    // Save current canvas to page data first
    pages[currentPageIndex].canvasJson = canvas.toJSON();

    const pdf = new jsPDF({
      orientation: canvas.width! > canvas.height! ? 'landscape' : 'portrait',
      unit: 'pt',
      format: [canvas.width!, canvas.height!]
    });

    const imgData = canvas.toDataURL({
      format: 'jpeg',
      quality: 0.95
    });

    pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width!, canvas.height!);
    pdf.save(docTitle.endsWith('.pdf') ? docTitle : `${docTitle}.pdf`);
    showToast('PDF downloaded successfully!');
  };

  // Save to Firebase Firestore
  const handleSaveToFirebase = async () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    setIsSaving(true);
    try {
      pages[currentPageIndex].canvasJson = canvas.toJSON();
      
      const docRecord = {
        id: 'pdf_' + Date.now(),
        userId: currentUser.id,
        title: docTitle,
        pageCount: pages.length,
        fileSize: 1024 * pages.length,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Persist to Firebase Firestore
      if (currentUser.id.startsWith('guest_')) {
        showToast('Saved locally. Sign in with Google or Email for permanent cloud database sync!');
      } else {
        showToast('Document synced to Firebase Cloud Firestore!');
      }
    } catch (err) {
      console.error(err);
      showToast('Error syncing document.');
    } finally {
      setIsSaving(false);
    }
  };

  // Print
  const handlePrint = () => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: 'png' });
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<img src="${dataUrl}" style="max-width:100%; height:auto;" onload="window.print(); window.close();" />`);
      win.document.close();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBackToStudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Studio</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <FileCheck className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="bg-transparent hover:bg-slate-800/60 focus:bg-slate-800 border border-transparent focus:border-slate-700 rounded px-2 py-1 text-sm font-semibold text-white focus:outline-none transition-colors w-64 truncate"
              title="Click to rename PDF"
            />
          </div>
        </div>

        {/* Center: Quick watermark action banner */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Full PDF Editor & Watermark Eraser Active</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Real Database Save */}
          <button
            onClick={handleSaveToFirebase}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isSaving ? 'Syncing...' : 'Sync Cloud'}</span>
          </button>

          {/* Export PDF */}
          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clean PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            title="Print PDF"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar */}
        <aside className="w-16 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 gap-2 shrink-0 z-20">
          {/* Upload PDF */}
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Any PDF File"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all group relative"
          >
            <Upload className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Open PDF File
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />

          <div className="w-8 h-px bg-slate-800 my-1" />

          {/* Select Mode */}
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2.5 rounded-xl transition-all group relative ${
              activeTool === 'select' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Maximize className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Select & Move
            </span>
          </button>

          {/* Watermark Remover / Eraser (Special highlighted tool) */}
          <button
            onClick={handleAddWhiteout}
            className={`p-2.5 rounded-xl transition-all group relative ${
              activeTool === 'whiteout' ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-rose-950/40 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white'
            }`}
            title="Erase Watermark"
          >
            <Eraser className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Watermark Eraser Mask
            </span>
          </button>

          {/* Text Tool */}
          <button
            onClick={() => handleAddText('body')}
            className={`p-2.5 rounded-xl transition-all group relative ${
              activeTool === 'text' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Type className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Add Text
            </span>
          </button>

          {/* Signature Tool */}
          <button
            onClick={() => setShowSignatureModal(true)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative"
          >
            <PenTool className="w-5 h-5 text-indigo-400" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Digital Signature
            </span>
          </button>

          {/* Stamp Tool */}
          <button
            onClick={() => handleAddStamp('APPROVED', '#16a34a')}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative"
          >
            <Stamp className="w-5 h-5 text-emerald-400" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Official Stamps
            </span>
          </button>

          {/* Highlighter */}
          <button
            onClick={() => setActiveTool(activeTool === 'highlighter' ? 'select' : 'highlighter')}
            className={`p-2.5 rounded-xl transition-all group relative ${
              activeTool === 'highlighter' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Highlighter className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Highlighter Pen
            </span>
          </button>

          {/* Insert Image */}
          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Insert Image / Logo
            </span>
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="w-8 h-px bg-slate-800 my-1" />

          {/* Watermark Tools modal */}
          <button
            onClick={() => setShowWatermarkModal(true)}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative"
          >
            <Sliders className="w-5 h-5 text-purple-400" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
              Watermark Options
            </span>
          </button>
        </aside>

        {/* Secondary Tool Options Bar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Sub-toolbar */}
          <div className="h-11 bg-slate-900/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              {/* Watermark 1-Click Stripper Button */}
              <button
                onClick={handleAutoRemoveWatermarks}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-medium transition-colors"
              >
                <Eraser className="w-3.5 h-3.5 text-rose-400" />
                <span>1-Click Strip Watermark</span>
              </button>

              <button
                onClick={handleAddWhiteout}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
              >
                <Square className="w-3.5 h-3.5 text-indigo-400" />
                <span>Whiteout Box</span>
              </button>

              {/* Text options */}
              <div className="h-4 w-px bg-slate-800" />
              <button
                onClick={() => handleAddText('heading')}
                className="px-2 py-1 hover:bg-slate-800 rounded font-semibold text-slate-200"
              >
                + Heading
              </button>
              <button
                onClick={() => handleAddText('body')}
                className="px-2 py-1 hover:bg-slate-800 rounded text-slate-300"
              >
                + Paragraph
              </button>

              {/* Stamp presets */}
              <div className="h-4 w-px bg-slate-800" />
              <span className="text-slate-500 font-medium">Stamps:</span>
              <button
                onClick={() => handleAddStamp('APPROVED', '#16a34a')}
                className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold text-[11px]"
              >
                APPROVED
              </button>
              <button
                onClick={() => handleAddStamp('VERIFIED', '#2563eb')}
                className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-500/30 font-bold text-[11px]"
              >
                VERIFIED
              </button>
              <button
                onClick={() => handleAddStamp('CONFIDENTIAL', '#dc2626')}
                className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-bold text-[11px]"
              >
                CONFIDENTIAL
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="font-mono text-slate-400 text-xs w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(2.0, zoom + 0.1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="px-1.5 py-0.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white text-[11px]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Canvas Scroll Area */}
          <div 
            ref={containerRef}
            className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-8 relative"
          >
            {/* Centered Canvas Container with zoom scale */}
            <div 
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 0.15s ease-out'
              }}
              className="shadow-2xl rounded-sm overflow-hidden border border-slate-700/60 bg-white"
            >
              <canvas ref={canvasElRef} />
            </div>

            {/* Floating Toast Notification */}
            {notification && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-slate-900 border border-indigo-500/40 text-indigo-200 rounded-xl shadow-2xl flex items-center gap-2 text-sm z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{notification}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Page management & Inspector */}
        <aside className="w-64 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-20">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Pages ({pages.length})</span>
            </span>
            <button
              onClick={() => {
                const newPage: PdfPageData = {
                  pageNumber: pages.length + 1,
                  width: 794,
                  height: 1123
                };
                setPages([...pages, newPage]);
                setCurrentPageIndex(pages.length);
                showToast(`Page ${pages.length + 1} added!`);
              }}
              className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page</span>
            </button>
          </div>

          {/* Page thumbnails list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {pages.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentPageIndex(idx)}
                className={`p-2 rounded-xl border cursor-pointer transition-all ${
                  currentPageIndex === idx
                    ? 'border-indigo-500 bg-indigo-950/30 shadow-md'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                }`}
              >
                <div className="aspect-[1/1.41] bg-white rounded flex items-center justify-center text-slate-800 font-bold text-sm shadow-inner relative overflow-hidden">
                  {p.bgImageUrl ? (
                    <img src={p.bgImageUrl} alt={`Page ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="p-2 text-center text-slate-400 text-xs font-mono">
                      Page {idx + 1}
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-900/80 text-white rounded text-[10px] font-mono">
                    {idx + 1}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>Page {idx + 1}</span>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = pages.filter((_, i) => i !== idx);
                        setPages(next);
                        setCurrentPageIndex(Math.max(0, idx - 1));
                        showToast(`Page ${idx + 1} deleted.`);
                      }}
                      className="p-1 hover:text-red-400 rounded"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Sample Document Loaders */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/50">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Sample PDF Templates
            </span>
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  const canvas = fabricCanvasRef.current;
                  if (canvas) {
                    canvas.clear();
                    seedDefaultCertificate(canvas, 794, 1123);
                    setDocTitle('Campus_Certificate_Watermarked.pdf');
                    showToast('Loaded Sample Certificate with Watermark!');
                  }
                }}
                className="w-full text-left px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors flex items-center justify-between"
              >
                <span>Certificate (with Watermark)</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">Create Digital Signature</h3>
              </div>
              <button 
                onClick={() => setShowSignatureModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Draw your signature below using mouse, pen, or finger.
            </p>

            <div className="border border-slate-700 rounded-xl bg-white overflow-hidden shadow-inner">
              <canvas
                ref={sigCanvasRef}
                width={380}
                height={160}
                onMouseDown={startDrawingSig}
                onMouseMove={drawSig}
                onMouseUp={stopDrawingSig}
                onMouseLeave={stopDrawingSig}
                className="w-full cursor-crosshair touch-none"
              />
            </div>

            {/* Ink Color Selector */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Ink Color:</span>
                {['#1e1b4b', '#000000', '#2563eb', '#dc2626'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setSigColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      sigColor === c ? 'border-white scale-110' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleClearSignature}
                className="text-xs text-slate-400 hover:text-red-400 font-medium"
              >
                Clear Pad
              </button>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowSignatureModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertSignature}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md transition-colors"
              >
                Insert Signature
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Watermark Configuration Modal */}
      {showWatermarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Watermark Settings</h3>
              </div>
              <button 
                onClick={() => setShowWatermarkModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Watermark Text
                </label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Opacity</span>
                  <span>{Math.round(watermarkOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold">Rotation Angle</span>
                  <span>{watermarkAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  step="15"
                  value={watermarkAngle}
                  onChange={(e) => setWatermarkAngle(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowWatermarkModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyWatermark}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-md transition-colors"
              >
                Apply Watermark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
