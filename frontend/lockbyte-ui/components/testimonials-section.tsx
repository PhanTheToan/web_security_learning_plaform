import { Quote } from "lucide-react"
import Image from "next/image";

const testimonials = [
  {
    quote:
      "CyberLock's team was instrumental in handling our security needs. We feel truly amazing knowing our data is protected.",
    author: "John Smith",
    role: "CEO, Tech Innovations",
    avatar: "/professional-male.jpg",
  },
  {
    quote:
      "The real-time monitoring service has been a game-changer for us. Highly recommended for any business serious about security.",
    author: "Mark Johnson",
    role: "CTO, Digital Solutions",
    avatar: "/professional-male-2.jpg",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold">What Our Clients Say</h2>
          <button className="bg-gradient-to-r from-[#9747ff] via-[#821db6] to-[#9747ff] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#821db6] text-[#ffffff] px-6 py-2 rounded-full text-sm transition-all duration-300">
            View More
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#ffffff]/5 via-[#ffffff]/3 to-[#9747ff]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 hover:from-[#ffffff]/8 hover:via-[#9747ff]/5 hover:to-[#9747ff]/10 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-[#9747ff] mb-4" />
              <p className="text-[#ffffff]/90 text-lg leading-relaxed mb-6">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-[#ffffff] font-semibold">{testimonial.author}</p>
                  <p className="text-[#ffffff]/60 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}