"use client"

import React from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface TemplateListProps {
  templates: string[]
  onUse: (templateName: string) => void
  onPreview: (templateName: string) => void
  isLoadingPreview: boolean
}

export function TemplatesList({ templates, onUse, onPreview, isLoadingPreview }: TemplateListProps) {
  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <Card key={template} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-200">
          <CardHeader>
            <CardTitle className="text-white">{template}</CardTitle>
            <CardDescription className="text-gray-400">
              A brief description of the {template} template.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => onPreview(template)}
              disabled={isLoadingPreview}
              className="bg-transparent border-[#9747ff]/50 text-white hover:bg-[#9747ff]/20 hover:text-white"
            >
              {isLoadingPreview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Preview
            </Button>
            <Button
              onClick={() => onUse(template)}
              className="bg-gradient-to-r from-[#9747ff] to-[#5a5bed] text-white hover:opacity-90 shadow-[0_0_15px_rgba(151,71,255,0.4)]"
            >
              Use
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
