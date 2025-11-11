"use client";
import { useState } from "react";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";

export default function MarkdownImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const { src = "", alt, className, ...rest } = props;
  const [open, setOpen] = useState(false);

  if (!src) return null;

  type ImageComponentProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'>;

  // Filter out props that are not valid for next/image when using fill
  const imageProps: ImageComponentProps = {
    className: `cursor-zoom-in object-contain ${className ?? ""}`,
    ...rest
  };

  return (
    <>
      <div className={`relative ${className ?? ""}`} style={{ width: '100%', height: 'auto' }}>
        <Image
          src={src}
          alt={alt || ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onClick={() => setOpen(true)}
          {...imageProps}
        />
      </div>
      {open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
