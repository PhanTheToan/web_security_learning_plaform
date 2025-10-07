import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Shield, Target, Users, Award, TrendingUp, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const stats = [
    { value: "500+", label: "Clients Protected" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "24/7", label: "Security Monitoring" },
    { value: "50+", label: "Security Experts" },
]

const values = [
    {
        icon: Shield,
        title: "Security First",
        description: "We prioritize your security above all else, implementing industry-leading practices and protocols.",
    },
    {
        icon: Target,
        title: "Precision & Accuracy",
        description: "Our solutions are built with meticulous attention to detail, ensuring maximum effectiveness.",
    },
    {
        icon: Users,
        title: "Client-Centric",
        description: "Your success is our success. We tailor our services to meet your unique security needs.",
    },
    {
        icon: Award,
        title: "Excellence",
        description: "We maintain the highest standards in cybersecurity, continuously improving our capabilities.",
    },
    {
        icon: TrendingUp,
        title: "Innovation",
        description: "We stay ahead of emerging threats with cutting-edge technology and proactive strategies.",
    },
    {
        icon: Globe,
        title: "Global Reach",
        description: "Our expertise spans across industries and continents, protecting businesses worldwide.",
    },
]

const team = [
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
        name: "Emily Watson",
        role: "Director of Operations",
        image: "/professional-woman-director.png",
    },
    {
        name: "David Kim",
        role: "Lead Security Architect",
        image: "/professional-man-architect.jpg",
    },
]

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#252d47]">
            <Header />

            {/* Hero Section */}
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-[#ffffff] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                            Protecting Businesses Since 2015
                        </h1>
                        <p className="text-[#ffffff]/70 text-lg md:text-xl leading-relaxed mb-8">
                            We're a team of cybersecurity experts dedicated to safeguarding your digital assets with innovative
                            solutions and unwavering commitment to excellence.
                        </p>
                        <Link href="/register">
                            <Button className="bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] px-8 py-6 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-105">
                                Join Our Mission
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-[#ffffff]/10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-[#9747ff] text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                                <div className="text-[#ffffff]/70 text-sm md:text-base">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-[#ffffff]/70 text-lg leading-relaxed mb-6">
                                At LockByte, we believe that every business deserves enterprise-grade security, regardless of size. Our
                                mission is to democratize cybersecurity by providing accessible, effective, and innovative solutions
                                that protect what matters most.
                            </p>
                            <p className="text-[#ffffff]/70 text-lg leading-relaxed">
                                We combine cutting-edge technology with human expertise to create a security ecosystem that adapts to
                                your needs, scales with your growth, and evolves with emerging threats.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff]/10 aspect-square flex items-center justify-center shadow-[0_0_40px_rgba(151,71,255,0.15)]">
                            <img
                                src="/cybersecurity-team.png"
                                alt="Our Mission"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-[#1a2035]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-[#ffffff]/70 text-lg max-w-2xl mx-auto">
                            These principles guide everything we do and shape how we serve our clients.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-xl p-6 border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]"
                            >
                                <div className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 shadow-lg">
                                    <value.icon className="w-6 h-6 text-[#9747ff]" />
                                </div>
                                <h3 className="text-[#ffffff] text-xl font-semibold mb-3">{value.title}</h3>
                                <p className="text-[#ffffff]/70 leading-relaxed">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold mb-4">Meet Our Leadership</h2>
                        <p className="text-[#ffffff]/70 text-lg max-w-2xl mx-auto">
                            Our team of experts brings decades of combined experience in cybersecurity and technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm rounded-xl overflow-hidden border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-500 hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02]"
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-[#ffffff] text-xl font-semibold mb-2">{member.name}</h3>
                                    <p className="text-[#9747ff] text-sm">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-[#ffffff]/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-[#ffffff] text-3xl md:text-4xl font-bold mb-6">Ready to Secure Your Business?</h2>
                        <p className="text-[#ffffff]/70 text-lg mb-8">
                            Join hundreds of companies that trust LockByte to protect their digital assets.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/register">
                                <Button className="bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] px-8 py-6 text-base rounded-full transition-all duration-500 shadow-[0_0_30px_rgba(151,71,255,0.4)] hover:shadow-[0_0_40px_rgba(151,71,255,0.6)] hover:scale-105">
                                    Get Started Today
                                </Button>
                            </Link>
                            <Link href="/#contact">
                                <Button
                                    variant="outline"
                                    className="border-[#ffffff]/20 text-[#ffffff] hover:bg-[#ffffff]/10 px-8 py-6 text-base rounded-full bg-transparent"
                                >
                                    Contact Sales
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
