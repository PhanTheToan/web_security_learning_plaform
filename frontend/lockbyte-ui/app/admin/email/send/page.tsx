"use client"

import React, { useState } from "react"
import { SendForm } from "@/components/admin/email/send-form"
import { HtmlPreview } from "@/components/admin/email/shared/html-preview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SendEmailPage() {
  const [previewContent, setPreviewContent] = useState(
    "<html><head></head><body><p>Email preview will appear here.</p></body></html>"
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-1">
        <SendForm setPreviewContent={setPreviewContent} />
      </div>
      <div className="lg:col-span-2">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-white">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="sticky top-24">
              <HtmlPreview content={previewContent} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
