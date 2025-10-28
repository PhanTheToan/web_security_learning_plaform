"use client";
import { useState } from "react";
import ImageLightbox from "@/components/ImageLightbox";

export default function MarkdownImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src = "", alt, ...rest } = props;
  const [open, setOpen] = useState(false);

  if (!src) return null;

  return (
    <>
      <img
        src={src}
        alt={alt}
        {...rest}
        onClick={() => setOpen(true)}
        className={`cursor-zoom-in ${rest.className ?? ""}`}
      />
      {open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
