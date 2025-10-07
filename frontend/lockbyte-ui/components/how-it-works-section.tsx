import { UserPlus, Rocket, Activity, FileText } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Assess",
    description: "Understand your security needs.",
  },
  {
    number: "02",
    icon: Rocket,
    title: "Deploy",
    description: "Implement tailored solutions.",
  },
  {
    number: "03",
    icon: Activity,
    title: "Monitor",
    description: "Continuous threat surveillance.",
  },
  {
    number: "04",
    icon: FileText,
    title: "Report",
    description: "Transparent insights and updates.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-[#252d47] py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold text-center mb-16">How LockByte Works</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gradient-to-br from-[#ffffff]/5 via-[#ffffff]/3 to-[#9747ff]/5 backdrop-blur-sm rounded-xl p-6 border border-[#ffffff]/10 hover:from-[#ffffff]/8 hover:via-[#9747ff]/5 hover:to-[#9747ff]/10 transition-all duration-300 text-center">
                <div className="bg-gradient-to-br from-[#9747ff] to-[#821db6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#9747ff]/20">
                  <step.icon className="w-8 h-8 text-[#ffffff]" />
                </div>
                <h3 className="text-[#ffffff] text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-[#ffffff]/70 text-sm leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-[#9747ff]/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
