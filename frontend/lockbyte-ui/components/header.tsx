'use client';

import { LockIcon } from '@/components/icons/lock-icon';
import { Menu, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useRouter } from 'next/navigation';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  const handleSelect = (value: string) => {
    if (value === 'profile') {
      router.push('/profile');
    } else if (value === 'logout') {
      logout();
    }
  };

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
            <Link href="/ranking" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Ranking
            </Link>
            <Link href="/topics" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Topic
            </Link>
            <Link href="/labs" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
              Lab
            </Link>
            {user && (
              <Link href="/dashboard" className="text-[#ffffff]/80 hover:text-[#ffffff] text-sm transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-gray-600/50 animate-pulse rounded-full"></div>
            ) : user ? (
              <Select onValueChange={handleSelect}>
                <SelectTrigger className="w-auto h-auto p-0 border-none focus:ring-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.avatarUrl ?? '/avatar.png'}
                      alt={user.fullName ?? user.username}
                    />
                    <AvatarFallback>
                      {user.fullName?.charAt(0) ?? user.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                  <SelectItem 
                    value="profile" 
                    className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </div>
                  </SelectItem>
                  <SelectItem 
                    value="logout" 
                    className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200"
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
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
            <button className="text-[#ffffff]/80 hover:text-[#ffffff] transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
