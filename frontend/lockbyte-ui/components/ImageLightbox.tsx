"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, Minus, RefreshCw } from "lucide-react";
import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  onClose: () => void;
};

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_STEP = 0.2;

export default function ImageLightbox({ src, alt, onClose }: Props) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const isPanning = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleZoom = (delta: number) => {
    setScale(prev => Math.max(MIN_SCALE, Math.min(MAX_SCALE, prev + delta)));
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    handleZoom(e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP);
  };

  // Panning logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    isPanning.current = true;
    startPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    if (imageRef.current) {
      imageRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current || scale <= 1) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - startPos.current.x,
      y: e.clientY - startPos.current.y,
    });
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    if (imageRef.current) {
      imageRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }
  };

  // Reset cursor on scale change
  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.style.cursor = scale > 1 ? "grab" : "default";
    }
    if (scale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <figure
        className="relative max-w-full max-h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={resetZoom}
      >
        <Image
          ref={imageRef}
          src={src}
          alt={alt || "Lightbox image"}
          width={1200}
          height={800}
          className="max-w-full max-h-full rounded-lg shadow-2xl select-none transition-transform duration-100"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            maxWidth: 'calc(100vw - 40px)',
            maxHeight: 'calc(100vh - 80px)',
            objectFit: 'contain',
          }}
          draggable={false}
          onMouseDown={handleMouseDown}
        />
        {alt && scale === 1 && (
          <figcaption className="absolute bottom-4 text-center text-sm text-white/80 bg-black/30 px-3 py-1 rounded-full">
            {alt}
          </figcaption>
        )}
      </figure>

      {/* Controls */}
      <div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full p-2 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zoom Out"
          onClick={() => handleZoom(-ZOOM_STEP)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-50"
          disabled={scale <= MIN_SCALE}
        >
          <Minus size={18} />
        </button>
        <button
          type="button"
          aria-label="Reset Zoom"
          onClick={resetZoom}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          <RefreshCw size={16} />
        </button>
        <button
          type="button"
          aria-label="Zoom In"
          onClick={() => handleZoom(ZOOM_STEP)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 disabled:opacity-50"
          disabled={scale >= MAX_SCALE}
        >
          <Plus size={18} />
        </button>
      </div>

      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 w-9 h-9 text-white text-lg"
      >
        ×
      </button>
    </div>,
    document.body
  );
}
