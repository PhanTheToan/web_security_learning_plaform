import React from "react"
import { ThemeViewer } from "@/components/admin/email/theme-viewer"

export default function ThemePartialsPage() {
  return (
    <div className="space-y-6 text-white">
      <h1 className="text-2xl font-bold">Theme & Partials</h1>
      <p className="text-gray-400">
        This section displays the current email theme configuration and lists available partials.
        Currently, this is a read-only view based on mock data.
      </p>
      <ThemeViewer />
    </div>
  )
}
