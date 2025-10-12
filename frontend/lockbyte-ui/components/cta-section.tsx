"use client";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export function CtaSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold mb-6 leading-tight">
              Secure your business today with CyberLock.
            </h2>
            <p className="text-[#ffffff]/70 text-lg mb-8 leading-relaxed">
              Join hundreds of businesses that trust us with their cybersecurity needs.
            </p>
            <Button className="bg-gradient-to-r from-[#9747ff] via-[#821db6] to-[#9747ff] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#821db6] text-[#ffffff] px-6 py-6 text-base rounded-full transition-all duration-300">
              Request Demo
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="aspect-video flex items-center justify-center">
              <div className="relative w-full h-full">
                <DotLottieReact
                  src="/Artificial intelligence digital technology.lottie"
                  loop
                  autoplay
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}