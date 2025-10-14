'use client';

import { LockIcon } from '@/components/icons/lock-icon';
import { Search, Menu, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-[#252d47]/90 backdrop-blur-lg border-b border-[#ffffff]/10 shadow-lg'
        : 'bg-[#252d47] border-b border-transparent'
        }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <LockIcon className="w-6 h-6 text-[#9747ff]" />
            <span className="text-[#ffffff] font-semibold text-lg">CyberLock</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/about" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              About
            </Link>
            <Link href="/topics" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Services
            </Link>
            <a href="#team" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Team
            </a>
            <a href="#pricing" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-600/50 animate-pulse rounded-full"></div>
            ) : user ? (
              <>
                <span className="hidden sm:flex items-center gap-2 text-sm text-white">
                  <User className="w-4 h-4 text-[#9747ff]" />
                  {user.fullName || user.username}
                </span>
                <Button
                  onClick={logout}
                  variant="outline"
                  className="border-[#ffffff]/20 text-[#ffffff] hover:bg-[#ffffff]/10 bg-transparent rounded-full h-9 px-4 text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden md:block bg-gradient-to-r from-[#9747ff] via-[#5a5bed] to-[#821db6] hover:from-[#821db6] hover:via-[#9747ff] hover:to-[#5a5bed] text-[#ffffff] px-4 py-2 text-sm rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(151,71,255,0.3)] hover:shadow-[0_0_30px_rgba(151,71,255,0.5)]"
                >
                  Get Started
                </Link>
              </>
            )}
            <button className="text-[#ffffff]/80 hover:text-[#ffffff] transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-[#ffffff]/80 hover:text-[#ffffff] transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
