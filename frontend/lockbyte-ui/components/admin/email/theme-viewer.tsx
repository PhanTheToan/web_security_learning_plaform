"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for theme and partials
const themeJson = {
  brandColor: "#4F46E5",
  companyName: "Lockbyte Inc.",
  footerNote: "© 2025 Lockbyte Inc. All rights reserved.",
  ctaUrl: "https://lockbyte.dev/dashboard",
}

const partialsList = [
  "partials/header.hbs",
  "partials/footer.hbs",
  "partials/button.hbs",
  "partials/invoice-item.hbs",
]

export function ThemeViewer() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme Configuration (theme.json)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
            <code>{JSON.stringify(themeJson, null, 2)}</code>
          </pre>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Available Partials</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {partialsList.map((partial) => (
              <li key={partial}>
                <code>{partial}</code>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
