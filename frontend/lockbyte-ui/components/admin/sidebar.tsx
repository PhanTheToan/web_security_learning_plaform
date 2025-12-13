"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BookOpen, Code, Mail, User } from "lucide-react"
import { LockIcon } from "@/components/icons/lock-icon"

const Sidebar = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/admin/dashboard", icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard" },
    { href: "/profile", icon: <User className="h-5 w-5" />, label: "Profile" },
    { href: "/admin/users", icon: <Users className="h-5 w-5" />, label: "Users" },
    { href: "/admin/labs", icon: <Code className="h-5 w-5" />, label: "Labs" },
    { href: "/admin/topics", icon: <BookOpen className="h-5 w-5" />, label: "Topics" },
    { href: "/admin/email/send", icon: <Mail className="h-5 w-5" />, label: "Email" },
    
  ]

  return (
    <aside className="w-64 flex-shrink-0 bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 backdrop-blur-sm text-foreground flex flex-col border-r border-[#ffffff]/10">
      <div className="h-20 flex items-center justify-center border-b border-[#ffffff]/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
          <LockIcon className="w-8 h-8 text-[#9747ff] transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(151,71,255,0.8)]" />
          <span className="text-2xl font-bold tracking-wider text-white">LockByte</span>
        </Link>
      </div>
      <nav className="flex-grow px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative group ${isActive
                    ? "bg-gradient-to-br from-[#9747ff]/10 via-[#5a5bed]/8 to-[#821db6]/10 text-foreground font-medium border border-[#9747ff]/60 shadow-[0_0_20px_rgba(151,71,255,0.2)]"
                    : "text-[#ffffff]/70 hover:bg-gradient-to-br hover:from-[#ffffff]/5 hover:via-[#9747ff]/5 hover:to-[#5a5bed]/5 hover:text-foreground hover:border hover:border-[#ffffff]/20"
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-gradient-to-b from-[#9747ff] via-[#5a5bed] to-[#821db6] rounded-r-full shadow-[0_0_10px_rgba(151,71,255,0.5)]" />
                  )}
                  <span
                    className={`transition-all duration-300 ${isActive ? "text-[#9747ff]" : "text-[#ffffff]/70 group-hover:text-[#9747ff]"}`}
                  >
                    {item.icon}
                  </span>
                  <span className={`
                    ${isActive ? 'font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'text-[#ffffff]/70 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]'}
                    transition-all duration-300
                  `}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-[#ffffff]/10">{/* User profile can go here later */}</div>
    </aside>
  )
}

export { Sidebar }
