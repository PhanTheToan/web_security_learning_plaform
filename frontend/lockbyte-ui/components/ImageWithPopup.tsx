"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImageWithPopupProps {
  src?: string;
  alt?: string;
}

export function ImageWithPopup({ src, alt }: ImageWithPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <img
          src={src}
          alt={alt}
          className="cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-[1.02]"
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-auto bg-black/80 backdrop-blur-lg border-white/20 p-2 rounded-lg">
        <img src={src} alt={alt} className="max-w-full max-h-[80vh] h-auto w-auto object-contain mx-auto" />
      </DialogContent>
    </Dialog>
  );
}