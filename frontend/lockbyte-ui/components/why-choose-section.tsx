"use client";
import { Lightbulb, Users, Clock, CheckCircle } from "lucide-react"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
    <section className="bg-white dark:bg-gray-900/80 py-20 backdrop-blur-sm">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className=" rounded-2xl p-4 aspect-square flex items-center justify-center">
              <DotLottieReact
                src="/maintenance cyber security.lottie"
                loop
                autoplay
              />
            </div>
          </div>

          <div>
            <h2 className="text-[#252d47] text-3xl md:text-4xl font-bold mb-12">Why Choose CyberLock?</h2>

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
              ))
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}