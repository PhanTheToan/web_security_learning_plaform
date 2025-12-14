"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

const tabs = [
  { name: "Send", href: "/admin/email/send" },
  { name: "Templates", href: "/admin/email/templates" },
  { name: "Logs", href: "/admin/email/logs" },
  { name: "Groups", href: "/admin/email/groups" },
  { name: "Jobs", href: "/admin/email/jobs" },
]

export default function EmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const currentTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.href || tabs[0].href

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            Email Management
          </h1>
          <p className="text-white/60 mt-1">
            Send emails, manage templates, and view logs.
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        {tabs.map((tab) => (
          <Link href={tab.href} key={tab.href} passHref>
            <div
              className={`cursor-pointer px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                ${currentTab === tab.href
                  ? "bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/20 text-white border border-[#9747ff]/50 shadow-[0_0_15px_rgba(151,71,255,0.3)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
            >
              {tab.name}
            </div>
          </Link>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 backdrop-blur-sm border-[#ffffff]/10 shadow-lg">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  )
}
