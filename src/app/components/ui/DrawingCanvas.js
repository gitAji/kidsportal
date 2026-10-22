import React, { useRef, useEffect, useState } from 'react';
import { FaEraser, FaPaintBrush, FaUndo } from 'react-icons/fa';
import { scoreTraceMatch } from '@/app/utils/traceMatch';

// Two stacked canvases: a static template layer (the dashed guide letter,
// never touched by drawing) behind a transparent ink layer (only the
// child's own strokes). Keeping them separate — instead of drawing both on
// one canvas like before — is what lets "Done!" actually check whether the
// strokes follow the template, with no AI/network call involved.
export default function DrawingCanvas({
  width = 600,
  height = 400,
  template = null,
  onFinish = null
}) {
  const templateCanvasRef = useRef(null);
  const inkCanvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#FF6B6B'); // Vibrant Red
  const [brushSize, setBrushSize] = useState(10);
  const colors = [
    { name: 'Red', hex: '#FF6B6B' },
    { name: 'Blue', hex: '#4D96FF' },
    { name: 'Green', hex: '#6BCB77' },
    { name: 'Yellow', hex: '#FFD93D' },
    { name: 'Purple', hex: '#9d50bb' },
    { name: 'Orange', hex: '#f6d365' },
    { name: 'Pink', hex: '#ff9a9e' },
    { name: 'Indigo', hex: '#4F46E5' },
    { name: 'Black', hex: '#1E293B' },
  ];

  // Shared so the mask built for scoring lines up exactly with what's drawn
  // on screen.
  const applyGlyphStyle = (ctx, w, h) => {
    ctx.font = `bold ${Math.min(w, h) * 0.8}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  };
  const glyphPosition = (w, h) => ({ x: w / 2, y: h / 2 + 20 });

  const drawTemplate = (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    if (!template) return;
    applyGlyphStyle(ctx, w, h);
    const { x, y } = glyphPosition(w, h);
    ctx.fillStyle = '#E2E8F0'; // Slate 200
    ctx.fillText(template, x, y);

    // Optional: add dashed outline/guides
    ctx.strokeStyle = '#94A3B8'; // Slate 400
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.strokeText(template, x, y);
    ctx.setLineDash([]);
  };

  // A separate, un-rendered canvas used only to score the trace: just the
  // glyph's outline, stroked solid (no dashes, no fill) at roughly a kid's
  // brush width. The visible template also shows a light fill so the letter
  // is easy to recognize, but tracing is about following that outline, not
  // coloring in the whole solid shape — scoring against the fill would
  // unfairly fail a perfectly good outline trace.
  const buildOutlineMaskCanvas = (w, h, dpr) => {
    const canvas = document.createElement('canvas');
    const ctx = setupCanvas(canvas, w, h, dpr);
    applyGlyphStyle(ctx, w, h);
    const { x, y } = glyphPosition(w, h);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 14;
    ctx.strokeText(template, x, y);
    return canvas;
  };

  const setupCanvas = (canvas, w, h, dpr) => {
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const context = canvas.getContext('2d');
    context.scale(dpr, dpr);
    return context;
  };

  useEffect(() => {
    const inkCanvas = inkCanvasRef.current;
    const templateCanvas = templateCanvasRef.current;
    if (!inkCanvas || !templateCanvas) return;
    const dpr = window.devicePixelRatio || 1;

    const inkContext = setupCanvas(inkCanvas, width, height, dpr);
    inkContext.lineCap = 'round';
    inkContext.lineJoin = 'round';
    inkContext.strokeStyle = color;
    inkContext.lineWidth = brushSize;
    contextRef.current = inkContext;

    const templateContext = setupCanvas(templateCanvas, width, height, dpr);
    drawTemplate(templateContext, width, height);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, template]);

  useEffect(() => {
    if (contextRef.current) {
      // The eraser actually clears pixels (destination-out) rather than
      // painting an opaque white stroke — otherwise "erased" ink would
      // still count as ink when checking a traced letter against its
      // template, and it wouldn't cleanly reveal the template underneath.
      contextRef.current.globalCompositeOperation = color === '#FFFFFF' ? 'destination-out' : 'source-over';
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const getCoordinates = (event) => {
    const canvas = inkCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, width, height);
  };

  const handleDone = () => {
    const inkCanvas = inkCanvasRef.current;
    const imageData = inkCanvas.toDataURL();
    if (!template) {
      onFinish(imageData);
      return;
    }
    const dpr = window.devicePixelRatio || 1;
    const maskCanvas = buildOutlineMaskCanvas(width, height, dpr);
    const match = scoreTraceMatch(maskCanvas, inkCanvas, 18 * dpr);
    onFinish(imageData, match);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-100 p-4 md:p-6 mb-4">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <canvas
            ref={templateCanvasRef}
            className="absolute inset-0 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl w-full h-full pointer-events-none"
          />
          <canvas
            ref={inkCanvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="absolute inset-0 cursor-crosshair w-full h-full"
            style={{ touchAction: 'none' }}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 bg-white p-4 rounded-full shadow-lg border border-slate-100 w-full md:w-auto">
        <div className="flex items-center gap-2">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${color === c.hex ? 'border-amber-400 scale-110 shadow-md ring-2 ring-amber-100' : 'border-transparent opacity-80'}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <div className="w-px h-8 bg-slate-100 mx-2" />
          <button
            onClick={() => setColor('#FFFFFF')}
            className={`p-2.5 rounded-xl transition-all ${color === '#FFFFFF' ? 'bg-amber-100 text-amber-600 shadow-sm' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
            title="Eraser"
          >
            <FaEraser size={20} />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block" />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:inline">Size</span>
            <input
              type="range"
              min="2"
              max="40"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-amber-500 cursor-pointer"
            />
          </div>

          <button
            onClick={clearCanvas}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 border-b-4 border-slate-300"
          >
            <FaUndo /> <span className="hidden sm:inline">Start Over</span>
          </button>

          {onFinish && (
            <button
              onClick={handleDone}
              className="px-8 py-2.5 bg-green-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-100 active:scale-95 border-b-4 border-green-700"
            >
              Done!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
