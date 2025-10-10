import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function QuickShortcuts() {
  return (
    <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 h-full hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Shortcuts</h3>
      <div className="space-y-4">
        <Button className="w-full justify-start text-left bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 border border-[#ffffff]/10 text-white hover:bg-gradient-to-br hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
          <Icons.PlusSquare className="w-5 h-5 mr-3 text-[#9747ff]" />
          Add New Lab
        </Button>
        <Button className="w-full justify-start text-left bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 border border-[#ffffff]/10 text-white hover:bg-gradient-to-br hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
          <Icons.BookOpen className="w-5 h-5 mr-3 text-[#9747ff]" />
          Add New Topic
        </Button>
        <Button className="w-full justify-start text-left bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 border border-[#ffffff]/10 text-white hover:bg-gradient-to-br hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
          <Icons.UsersGroup className="w-5 h-5 mr-3 text-[#9747ff]" />
          Manage Users
        </Button>
      </div>
    </div>
  )
}
