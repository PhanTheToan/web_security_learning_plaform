import type React from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="admin-theme flex h-screentext-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <AdminHeader />
        <main className="p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
