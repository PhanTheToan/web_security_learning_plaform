import { Shield, Globe, Users, Briefcase, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="py-12">
      {/* Newsletter Section */}
      <div className="border-b border-[#ffffff]/10">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-[#ffffff] text-xl font-semibold mb-2">
                Stay updated with the latest in Cybersecurity
              </h3>
              <p className="text-[#ffffff]/60 text-sm">Subscribe to our newsletter for security tips and updates</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Email address"
                className="bg-[#ffffff]/5 border-[#ffffff]/10 text-[#ffffff] placeholder:text-[#ffffff]/40 min-w-[300px]"
              />
              <Button className="bg-gradient-to-r from-[#9747ff] via-[#821db6] to-[#9747ff] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#821db6] text-[#ffffff] px-6 rounded-full transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[#9747ff]" />
              <span className="text-[#ffffff] font-semibold text-lg">CyberLock</span>
            </div>
            <p className="text-[#ffffff]/60 text-sm leading-relaxed">
              Protecting businesses from cyber threats since 2020.
            </p>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-[#ffffff] font-semibold mb-4">About Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Company
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Team
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[#ffffff] font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Threat Intelligence
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Cloud Security
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Incident Response
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[#ffffff] font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-[#ffffff] font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-[#ffffff]/60 hover:text-[#ffffff] text-sm transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#ffffff]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#ffffff]/60 text-sm">© 2025 CyberLock - PTT Cybersecurity. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Globe className="w-4 h-4 text-[#9747ff]" />
            <Users className="w-4 h-4 text-[#5a5bed]" />
            <Briefcase className="w-4 h-4 text-[#9747ff]" />
            <Mail className="w-4 h-4 text-[#5a5bed]" />
            <Phone className="w-4 h-4 text-[#9747ff]" />
          </div>
        </div>
      </div>
    </footer>
  )
}
