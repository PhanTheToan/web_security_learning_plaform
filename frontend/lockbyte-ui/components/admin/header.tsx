'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, User, LogOut, ExternalLink } from 'lucide-react';

// Helper function to generate title from pathname
const generateTitle = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length < 2) return 'Dashboard';

  const lastSegment = segments[segments.length - 1];
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
};

const AdminHeader = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const title = generateTitle(pathname);

  return (
    <header className="flex-shrink-0 h-20 flex items-center justify-between px-6 md:px-8 bg-[#0D1117] border-b border-gray-800">
      <h1 className="text-2xl font-bold text-white">{title}</h1>

      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full p-2 hover:bg-gray-800 transition-colors">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl || ''} alt={user.username} />
                <AvatarFallback>
                  {user.username ? user.username.charAt(0).toUpperCase() : 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="font-medium text-sm">{user.fullName || user.username}</span>
                <span className="text-xs text-gray-400">Admin</span>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-gray-500 hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <Link href="/" passHref>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Go to Main Site</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
};

export { AdminHeader };
