import type React from "react"

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: string
}

export function StatCard({ icon: Icon, title, value }: StatCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 cursor-pointer group hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-[#ffffff]/70 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 p-3 rounded-xl group-hover:from-[#9747ff]/30 group-hover:to-[#821db6]/20 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(151,71,255,0.3)]">
          <Icon className="w-8 h-8 text-[#9747ff] group-hover:text-[#ffffff] group-hover:scale-110 transition-all" />
        </div>
      </div>
    </div>
  )
}
