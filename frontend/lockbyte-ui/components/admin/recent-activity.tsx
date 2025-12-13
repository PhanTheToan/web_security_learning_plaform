"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { formatDistanceToNow, parseISO } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface RecentSolve {
  fullName: string
  labName: string
  completedAt: string
}

// A simple function to generate a consistent placeholder avatar based on username
const getAvatarPlaceholder = (name: string) => {
  const placeholders = [
    "/professional-woman-executive.png",
    "/professional-male.jpg",
    "/professional-man-architect.jpg",
    "/professional-male-2.jpg",
    "/professional-woman-director.png",
  ]
  // Simple hash function to pick a placeholder
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return placeholders[hash % placeholders.length]
}

export function RecentActivity() {
  const [recentSolves, setRecentSolves] = useState<RecentSolve[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchRecentSolves = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`${apiBaseUrl}/lab/user-recent`, { credentials: "include" })
        if (!res.ok) {
          throw new Error("Failed to fetch recent solves.")
        }
        const data = await res.json()
        setRecentSolves(data.body || [])
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentSolves()
  }, [apiBaseUrl])

  const renderSkeleton = () => (
    <ul className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <li key={index} className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full mr-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          <Skeleton className="h-4 w-16" />
        </li>
      ))}
    </ul>
  )

  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 shadow-[0_0_15px_rgba(151,71,255,0.15)]">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Solves</h3>

      <div>
        {isLoading ? (
          renderSkeleton()
        ) : recentSolves.length === 0 ? (
          <p className="text-white/70 text-center py-4">No recent activity found.</p>
        ) : (
          <ul className="space-y-4">
            {recentSolves.map((solve, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center">
                  <Image
                    src={getAvatarPlaceholder(solve.fullName)}
                    alt={solve.fullName}
                    width={40}
                    height={40}
                    className="rounded-full mr-4 ring-2 ring-primary/30"
                  />
                  <div>
                    <p className="font-semibold text-white">{solve.fullName}</p>
                    <p className="text-sm text-white/70">
                      solved <span className="text-primary font-medium">{solve.labName}</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/60">
                  {formatDistanceToNow(parseISO(solve.completedAt), { addSuffix: true })}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
