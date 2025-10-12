"use client"

import { UserPlus, Rocket, Activity, FileText } from "lucide-react"
import { motion, useScroll, useSpring, Variants } from "framer-motion"
import { useRef } from "react"

const steps = [
  {
    icon: UserPlus,
    title: "Assess",
    description: "We start by conducting a thorough assessment of your current security posture to identify vulnerabilities and areas for improvement.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "Based on the assessment, we deploy a customized suite of advanced security solutions and protocols tailored to your specific needs.",
  },
  {
    icon: Activity,
    title: "Monitor",
    description: "Our team provides 24/7 monitoring of your systems, using cutting-edge technology to detect and respond to threats in real-time.",
  },
  {
    icon: FileText,
    title: "Report",
    description: "You receive regular, transparent reports detailing security performance, threat analysis, and recommendations for ongoing enhancements.",
  },
]

export function HowItWorksSection() {
  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end center"],
  })

  // Use spring to make the fill animation smoother
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-20">
          How CyberLock Works
        </h2>

        <div ref={timelineRef} className="relative max-w-4xl mx-auto">
          {/* The timeline line */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-[#9747ff]/20">
            {/* The filling, glowing part of the line */}
            <motion.div
              className="absolute top-0 left-0 h-full w-full bg-[#9747ff] origin-top animate-glow"
              style={{ scaleY }}
            />
          </div>

          {steps.map((step, index) => {
            const isEven = index % 2 === 0
            const cardVariants: Variants = {
              hidden: {
                opacity: 0,
                x: isEven ? -100 : 100,
              },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                },
              },
            }

            return (
              <motion.div
                key={index}
                className="relative mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ amount: 0.5 }} // `once: true` removed
              >
                <div className="flex items-center">
                  {/* Timeline Item */}
                  <div
                    className={`w-full flex ${isEven ? "justify-start" : "justify-end"
                      }`}
                  >
                    <div className="w-1/2 px-4">
                      <motion.div
                        className="bg-gradient-to-br from-white/5 via-white/3 to-[#9747ff]/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-lg hover:from-white/10 hover:via-[#9747ff]/10 hover:to-[#9747ff]/20 transition-all duration-300"
                        variants={cardVariants}
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="flex items-center mb-4">
                          <div className="bg-gradient-to-br from-[#9747ff] to-[#821db6] w-12 h-12 rounded-full flex items-center justify-center mr-4 shadow-lg shadow-[#9747ff]/20">
                            <step.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-white text-2xl font-semibold">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>

                  {/* Timeline Dot - with animation */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-[#252d47] border-2 border-[#9747ff] rounded-full z-10"
                    whileInView={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5 }}
                    viewport={{ amount: 0.5 }}
                  ></motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}