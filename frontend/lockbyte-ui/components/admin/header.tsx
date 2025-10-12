"use client"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronsUpDown, User, LogOut, ExternalLink } from "lucide-react"

// Helper function to generate title from pathname
const generateTitle = (pathname: string): string => {
  const segments = pathname.split("/").filter(Boolean)
  if (segments.length < 2) return "Dashboard"

  const lastSegment = segments[segments.length - 1]
  // If the last segment is a UUID, go up one level
  if (/[a-f0-9]{8}-([a-f0-9]{4}-){3}[a-f0-9]{12}/.test(lastSegment) && segments.length > 2) {
    const parentSegment = segments[segments.length - 2]
    return parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1).replace(/-/g, " ")
  }

  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ")
}

const AdminHeader = () => {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const title = generateTitle(pathname)

  return (
    <header className="sticky top-0 z-10 flex-shrink-0 h-20 flex items-center justify-between px-6 md:px-8 bg-gradient-to-r from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 backdrop-blur-sm border-b border-[#ffffff]/10">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] via-[#9747ff] to-[#ffffff] bg-clip-text text-white">
        {title}
      </h1>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full p-2 hover:bg-gradient-to-br hover:from-[#9747ff]/10 hover:to-[#5a5bed]/10 transition-all duration-300 hover:shadow-[0_0_20px_rgba(151,71,255,0.3)]">
              <Avatar className="h-9 w-9 ring-2 ring-[#9747ff]/30">
                <AvatarImage src={user.avatarUrl || ""} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-[#9747ff] to-[#821db6] text-white">
                  {user.username ? user.username.charAt(0).toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="font-medium text-sm text-white">{user.fullName || user.username}</span>
                <span className="text-xs text-[#9747ff]">Admin</span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-[#ffffff]/70 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-[#252d47]/95 backdrop-blur-sm border-[#9747ff]/30 text-white" align="end">
            <DropdownMenuLabel className="text-white/80">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#ffffff]/10" />
            <DropdownMenuItem className="hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <Link href="/" passHref>
              <DropdownMenuItem className="hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Go to Main Site</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="bg-[#ffffff]/10" />
            <DropdownMenuItem
              onClick={logout}
              className="hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}

export { AdminHeader }
