import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="py-20 md:py-32 overflow-hidden"> {/* Thêm overflow-hidden nếu cần */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-[#ffffff] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              HACK TO LEARN
            </h1>
            <p className="text-[#ffffff]/70 text-lg mb-8 leading-relaxed">
              Hack to understand, destroy to build — At CyberLock, we turn the complex into simple, turn theory into practice and with a team of experts with 20 years of information security experience, are ready to turn your passion into a career.
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

          <div className="relative flex justify-center items-center h-[450px] md:h-[550px]">

            <div className="absolute w-[110%] h-[110%] border-2 border-t-[#5a5bed]/80 border-l-transparent border-r-transparent border-b-transparent rounded-full animate-spin-slow"></div>
            <div className="absolute w-[120%] h-[120%] border border-t-[#9747ff]/50 border-l-transparent border-r-transparent border-b-transparent rounded-full animate-spin-slow-reverse"></div>

            <div className="relative glitch-wrapper-subtle">
              <Image
                src="/cybersecurity-dashboard-interface.png"
                alt="Cyber Security Lock"
                width={600}
                height={450}
                className="relative z-10 w-full max-w-xl object-contain 
                 animate-float-and-rotate transform-gpu 
                 drop-shadow-[0_0_25px_rgba(151,71,255,0.7)] 
                 md:drop-shadow-[0_0_40px_rgba(151,71,255,0.9)]"
              />
            </div>

            <div className="absolute top-[10%] left-[15%] w-2 h-2 rounded-full bg-[#9747ff] blur-sm animate-sparkle" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-[20%] right-[10%] w-3 h-3 rounded-full bg-[#5a5bed] blur-md animate-sparkle" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-[30%] right-[25%] w-1.5 h-1.5 rounded-full bg-white blur-xs animate-sparkle" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-[15%] left-[20%] w-2 h-2 rounded-full bg-cyan-400 blur-sm animate-sparkle" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-[50%] left-[5%] w-1 h-1 rounded-full bg-white blur-sm animate-sparkle" style={{ animationDelay: '4s' }}></div>

            <span className="absolute z-20 top-[20%] left-[10%] text-cyan-400/70 font-mono text-lg animate-float-subtle" style={{ animationDelay: '0s' }}>0110</span>
            <span className="absolute z-20 bottom-[30%] right-[15%] text-purple-400/70 font-mono text-sm animate-float-subtle-2" style={{ animationDelay: '1.5s' }}>101</span>
            <span className="absolute z-20 top-[15%] right-[20%] text-cyan-400/50 font-mono text-xs animate-float-subtle" style={{ animationDelay: '3s' }}>001</span>
            <span className="absolute z-20 bottom-[10%] left-[10%] text-purple-400/50 font-mono text-base animate-float-subtle-2" style={{ animationDelay: '4s' }}>11010</span>
            <span className="absolute z-20 top-[40%] left-[18%] text-white/50 font-mono text-sm animate-float-subtle" style={{ animationDelay: '5.5s' }}>100</span>
            <span className="absolute z-20 top-[60%] right-[8%] text-cyan-400/60 font-mono text-lg animate-float-subtle-2" style={{ animationDelay: '6s' }}>01</span>
            <span className="absolute z-20 bottom-[40%] left-[25%] text-purple-400/60 font-mono text-xs animate-float-subtle" style={{ animationDelay: '7.5s' }}>111</span>
          </div>
        </div>
      </div>
    </section>
  )
}
