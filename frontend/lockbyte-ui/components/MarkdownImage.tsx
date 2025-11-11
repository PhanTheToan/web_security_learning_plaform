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
      <Image
        src={src}
        alt={alt || ""}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: '100%', height: 'auto' }}
        onClick={() => setOpen(true)}
        {...imageProps}
      />
      {open && <ImageLightbox src={src} alt={alt} onClose={() => setOpen(false)} />}
    </>
  );
}
