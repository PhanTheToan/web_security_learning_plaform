import { Lightbulb, Users, Clock, CheckCircle } from "lucide-react"

const features = [
  {
    icon: Lightbulb,
    title: "Innovative Tech",
    description: "Cutting-edge solutions to keep you ahead.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Seasoned professionals at your service.",
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Round-the-clock protection and support.",
  },
  {
    icon: CheckCircle,
    title: "Compliance-Ready",
    description: "Meet industry standards effortlessly.",
  },
]

export function WhyChooseSection() {
  return (
    <section className="bg-[#ffffff] py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="bg-[#f5f5f5] rounded-2xl p-8 aspect-square flex items-center justify-center">
              <img
                src="/security-team-collaboration.jpg"
                alt="Why Choose LockByte"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div>
            <h2 className="text-[#252d47] text-3xl md:text-4xl font-bold mb-12">Why Choose LockByte?</h2>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="bg-[#9747ff]/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#9747ff]" />
                  </div>
                  <div>
                    <h3 className="text-[#252d47] text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-[#252d47]/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
