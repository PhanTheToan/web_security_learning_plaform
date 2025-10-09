import React from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-800 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
