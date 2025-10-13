"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const ImageModal = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}: ImageModalProps) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          if (currentIndex > 0) {
            onNavigate(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex < images.length - 1) {
            onNavigate(currentIndex + 1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetView = () => {
    setZoom(1);
    setRotation(0);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = images[currentIndex];
    link.download = `image-${currentIndex + 1}.jpg`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm">
      <div className="flex h-full w-full flex-col max-h-screen">
        <div className="flex items-center justify-between p-4 text-white flex-shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {currentIndex + 1} of {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomOut}
              className="text-white hover:bg-white/20"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleZoomIn}
              className="text-white hover:bg-white/20"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRotate}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDownload}
              className="text-white hover:bg-white/20"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetView}
              className="text-white hover:bg-white/20 text-xs"
            >
              Reset
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                maxHeight: "calc(100vh - 160px)",
                maxWidth: "calc(100vw - 80px)",
              }}
              priority
            />
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-4 p-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(currentIndex + 1)}
              disabled={currentIndex === images.length - 1}
              className="text-white hover:bg-white/20 disabled:opacity-50"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageModal;
