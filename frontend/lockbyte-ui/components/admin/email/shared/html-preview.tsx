"use client"

import React from "react"

export function HtmlPreview({ content }: { content: string }) {
  return (
    <div className="w-full h-[70vh] rounded-lg bg-black/20 border border-white/10 shadow-lg overflow-hidden">
      <iframe
        srcDoc={content}
        className="w-full h-full bg-white"
        sandbox="allow-scripts"
        title="Email Preview"
      />
    </div>
  )
}
