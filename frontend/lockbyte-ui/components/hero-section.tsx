import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-[#252d47] py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-[#ffffff] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Proactive Protection for Reactive Times
            </h1>
            <p className="text-[#ffffff]/70 text-lg mb-8 leading-relaxed">
              Stay ahead of cyber threats with our comprehensive security solutions designed for modern businesses.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="relative bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] px-6 py-6 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-105">
                Get Started Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                className="border-[#ffffff]/20 text-[#ffffff] hover:bg-[#ffffff]/10 px-6 py-6 text-base rounded-full bg-transparent"
              >
                Watch Video
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-[#ffffff]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 aspect-square flex items-center justify-center">
              <img
                src="/cybersecurity-dashboard-interface.jpg"
                alt="Security Dashboard"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
