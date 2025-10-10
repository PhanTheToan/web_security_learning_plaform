"use client"

import { useState } from "react"
import Image from "next/image"

const newUsers = [
  {
    name: "Alice",
    avatar: "/professional-woman-executive.png",
    time: "5 minutes ago",
  },
  {
    name: "Bob",
    avatar: "/professional-male.jpg",
    time: "1 hour ago",
  },
  {
    name: "Charlie",
    avatar: "/professional-man-architect.jpg",
    time: "3 hours ago",
  },
]

const recentSolves = [
  {
    user: "David",
    avatar: "/professional-male-2.jpg",
    lab: "SQL Injection - Level 1",
    time: "10 minutes ago",
  },
  {
    user: "Eve",
    avatar: "/professional-woman-director.png",
    lab: "XSS Basic - Reflected",
    time: "25 minutes ago",
  },
]

export function RecentActivity() {
  const [activeTab, setActiveTab] = useState("newUsers")

  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="flex border-b border-primary/20 mb-4">
        <button
          onClick={() => setActiveTab("newUsers")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
            activeTab === "newUsers" 
              ? "text-white font-bold drop-shadow-[0_0_8px_rgba(151,71,255,0.7)]" 
              : "text-white/70 hover:text-white"
          }`}
        >
          {activeTab === "newUsers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          New Users
        </button>
        <button
          onClick={() => setActiveTab("recentSolves")}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 relative ${
            activeTab === "recentSolves" 
              ? "text-white font-bold drop-shadow-[0_0_8px_rgba(151,71,255,0.7)]" 
              : "text-white/70 hover:text-white"
          }`}
        >
          {activeTab === "recentSolves" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          Recent Solves
        </button>
      </div>

      <div>
        {activeTab === "newUsers" && (
          <ul className="space-y-4">
            {newUsers.map((user, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center">
                  <Image
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full mr-4 ring-2 ring-primary/30"
                  />
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                  </div>
                </div>
                <p className="text-xs text-white/60">{user.time}</p>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "recentSolves" && (
          <ul className="space-y-4">
            {recentSolves.map((solve, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-primary/10 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center">
                  <Image
                    src={solve.avatar || "/placeholder.svg"}
                    alt={solve.user}
                    width={40}
                    height={40}
                    className="rounded-full mr-4 ring-2 ring-primary/30"
                  />
                  <div>
                    <p className="font-semibold text-white">{solve.user}</p>
                    <p className="text-sm text-white/70">
                      solved <span className="text-primary font-medium">{solve.lab}</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-white/60">{solve.time}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
