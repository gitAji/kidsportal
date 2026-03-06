import React, { useRef, useEffect, useState } from 'react';
import { FaEraser, FaPaintBrush, FaUndo } from 'react-icons/fa';

export default function DrawingCanvas({
  width = 600,
  height = 400,
  template = null,
  onFinish = null
}) {
  const canvasRef = useRef(null);
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

  const drawTemplate = (ctx, w, h) => {
    if (!template) return;
    ctx.font = `bold ${Math.min(w, h) * 0.8}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#E2E8F0'; // Slate 200
    ctx.fillText(template, w / 2, h / 2 + 20);

    // Optional: add dashed outline/guides
    ctx.strokeStyle = '#94A3B8'; // Slate 400
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.strokeText(template, w / 2, h / 2 + 20);
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const context = canvas.getContext('2d');
      context.scale(dpr, dpr);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      contextRef.current = context;

      // Clear and Draw Template
      context.clearRect(0, 0, width, height);
      drawTemplate(context, width, height);
    }
  }, [width, height, template]);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
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
    const context = contextRef.current;
    context.clearRect(0, 0, width, height);
    drawTemplate(context, width, height);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-indigo-100 p-4 md:p-6 mb-4">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl cursor-crosshair w-full h-[300px] md:h-[400px]"
          style={{ touchAction: 'none' }}
        />
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
              onClick={() => onFinish(canvasRef.current.toDataURL())}
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
