"use client"

import React,
{ useState } from "react"
import { useRouter } from "next/navigation"
import { TemplatesList } from "@/components/admin/email/templates-list"
import { HtmlPreview } from "@/components/admin/email/shared/html-preview"
import { getEmailTemplateSchema, previewAdminEmail } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import { set } from "lodash"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TemplatesPage() {
  const router = useRouter()
  const [templates] = useState(["welcome", "digest", "report", "password-reset"])
  const [previewContent, setPreviewContent] = useState(
    "<html><body><p>Select a template to preview.</p></body></html>"
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleUseTemplate = (templateName: string) => {
    router.push(`/admin/email/send?template=${templateName}`)
  }

  const handlePreviewTemplate = async (templateName: string) => {
    setIsLoading(true)
    try {
      const schema = await getEmailTemplateSchema(templateName)
      const defaultModel: Record<string, unknown> = {}
      schema?.fields.forEach(field => {
        if (field.default) {
          set(defaultModel, field.key, field.default)
        }
      })

      const html = await previewAdminEmail({
        templateName,
        model: defaultModel,
      })
      setPreviewContent(html)
    } catch (error) {
      console.error("Failed to generate preview", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not generate template preview.",
      })
      setPreviewContent("<html><body><p>Error generating preview.</p></body></html>")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full text-white">
      <div>
        <h1 className="text-2xl font-bold mb-6">Email Templates</h1>
        <TemplatesList
          templates={templates}
          onUse={handleUseTemplate}
          onPreview={handlePreviewTemplate}
          isLoadingPreview={isLoading}
        />
      </div>
      <div>
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {isLoading ? "Generating Preview..." : "Preview"}
            </CardTitle>
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
