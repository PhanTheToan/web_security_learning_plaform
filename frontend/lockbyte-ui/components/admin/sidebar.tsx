'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, BookOpen, Code, Settings } from 'lucide-react';
import { LockIcon } from '@/components/icons/lock-icon';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', icon: <LayoutDashboard className="h-5 w-5" />, label: 'Dashboard' },
    { href: '/admin/users', icon: <Users className="h-5 w-5" />, label: 'Users' },
    { href: '/admin/labs', icon: <Code className="h-5 w-5" />, label: 'Labs' },
    { href: '/admin/topics', icon: <BookOpen className="h-5 w-5" />, label: 'Topics' },
    { href: '/admin/settings', icon: <Settings className="h-5 w-5" />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0D1117] text-white flex flex-col">
      <div className="h-20 flex items-center justify-center border-b border-gray-800">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <LockIcon className="w-8 h-8 text-purple-500" />
          <span className="text-2xl font-bold tracking-wider">LockByte</span>
        </Link>
      </div>
      <nav className="flex-grow px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors duration-200 relative ${isActive
                    ? 'bg-purple-600/20 text-white font-medium'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                    }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 bg-purple-500 rounded-r-full shadow-[0_0_10px_theme(colors.purple.500)]"></div>
                  )}
                  <span className={`transition-colors ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700/50">
        {/* User profile can go here later */}
      </div>
    </aside>
  );
};

export { Sidebar };
