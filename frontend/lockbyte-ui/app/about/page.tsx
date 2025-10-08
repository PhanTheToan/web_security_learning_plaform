'use client';

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Award, ShieldCheck, Users, Clock } from "lucide-react";
import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedNumberProps {
  to: string | number;
  initial?: number;
  delay?: number;
}

// --- Helper Component for Animated Numbers ---
function AnimatedNumber({ to, initial = 0, delay = 0 }: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { margin: "-100px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const valueString = String(to);
      const numericValue = parseFloat(valueString.replace(/[^0-9.]/g, ''));
      const suffix = valueString.replace(/[0-9.]/g, '');

      // Reset text content to initial before animating
      if (ref.current) {
        ref.current.textContent = initial + suffix;
      }

      const controls = animate(initial, numericValue, {
        duration: 2,
        delay,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = value.toFixed(valueString.includes('.') ? 1 : 0) + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, to, initial, delay]);

  return <span ref={ref}>{initial + (String(to).replace(/[0-9.]/g, ''))}</span>;
}

const stats = [
  { value: "500+", label: "Clients Protected", icon: ShieldCheck },
  { value: "99.9%", label: "Uptime Guarantee", icon: Award },
  { value: "24/7", label: "Support", icon: Clock },
  { value: "50+", label: "Security Experts", icon: Users },
];

const leadershipTeam = [
  {
    name: "Sarah Chen",
    role: "Chief Security Officer",
    image: "/professional-woman-executive.png",
  },
  {
    name: "Michael Rodriguez",
    role: "Head of Threat Intelligence",
    image: "/professional-executive-man.png",
  },
  {
    name: "David Kim",
    role: "Lead Security Architect",
    image: "/professional-man-architect.jpg",
  },
  {
    name: "Emily Watson",
    role: "Director of Operations",
    image: "/professional-woman-director.png",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#252d47] text-white">
      <Header />

      <main>
        {/* Part 1: Hero Section */}
        <section className="relative py-24 md:py-32 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#252d47] to-[#1a2035] z-0"></div>
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-[500px] h-[500px] bg-gradient-to-tr from-[#9747ff]/30 to-[#5a5bed]/30 rounded-full filter blur-3xl opacity-30"></div>
          </div>

          <div className="container relative z-10 mx-auto px-6 flex flex-col items-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Protecting Businesses Since <span className="text-[#9747ff]">2015</span>
            </h1>
            <p className="max-w-2xl text-lg md:text-xl text-white/70 mb-8">
              We are a collective of cybersecurity experts dedicated to safeguarding your digital world with cutting-edge solutions and an unwavering commitment to your security.
            </p>
            <Link href="/#contact">
              <Button className="bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-white px-8 h-12 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-105">
                Join Our Mission
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="relative z-10 container mx-auto px-6 mt-20 md:mt-28">
            <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ amount: 0.5 }}
                >
                  <stat.icon className="w-8 h-8 text-[#9747ff] mb-2" />
                  <div className="text-3xl md:text-4xl font-bold text-[#9747ff]">
                    {stat.value === "24/7" ? stat.value : <AnimatedNumber to={stat.value} delay={index * 0.1} />}
                  </div>
                  <div className="text-sm text-white/60 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Part 2: Meet Our Leadership */}
        <section className="py-20 md:py-28 bg-[#1a2035]">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Our team of experts brings decades of combined experience in cybersecurity, software engineering, and threat intelligence.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {leadershipTeam.map((member, index) => (
                <div
                  key={index}
                  className="group relative bg-[#2c3654] rounded-xl overflow-hidden text-center transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#9747ff]/20"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={`Portrait of ${member.name}`}
                      fill
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2c3654] via-transparent to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                    <p className="text-sm text-[#9747ff]">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
