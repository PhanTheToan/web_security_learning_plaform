import { Shield, Lock, Cloud, Activity, AlertTriangle, Server } from "lucide-react"

const services = [
  {
    icon: Activity,
    title: "Threat Intelligence",
    description:
      "Stay ahead of emerging threats with real-time intelligence gathering and analysis to protect your digital assets.",
  },
  {
    icon: Lock,
    title: "Firewall Solutions",
    description:
      "Advanced firewall protection that monitors and controls incoming and outgoing network traffic based on security rules.",
  },
  {
    icon: Shield,
    title: "Endpoint Security",
    description:
      "Comprehensive protection for all endpoints in your network, ensuring complete coverage against malware and attacks.",
  },
  {
    icon: Cloud,
    title: "Cloud Security",
    description:
      "Secure your cloud infrastructure with advanced monitoring, encryption, and compliance management solutions.",
  },
  {
    icon: AlertTriangle,
    title: "Incident Response",
    description:
      "Rapid response team ready to handle security incidents with proven methodologies and expert guidance.",
  },
  {
    icon: Server,
    title: "Network Security",
    description:
      "Protect your network infrastructure with advanced security protocols and continuous monitoring systems.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold text-center mb-16">Our Services</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded p-6 border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 group hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]"
            >
              <div className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-[#9747ff]/30 group-hover:to-[#821db6]/20 transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(151,71,255,0.3)]">
                <service.icon className="w-6 h-6 text-[#9747ff] group-hover:text-[#ffffff] transition-colors" />
              </div>
              <h3 className="text-[#ffffff] text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-[#ffffff]/70 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
