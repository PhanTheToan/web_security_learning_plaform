'use client';

import React, { useState } from 'react';
import { Icons } from '@/components/icons';
import Image from 'next/image';

const newUsers = [
  {
    name: 'Alice',
    avatar: '/professional-woman-executive.png',
    time: '5 minutes ago',
  },
  {
    name: 'Bob',
    avatar: '/professional-male.jpg',
    time: '1 hour ago',
  },
  {
    name: 'Charlie',
    avatar: '/professional-man-architect.jpg',
    time: '3 hours ago',
  },
];

const recentSolves = [
  {
    user: 'David',
    avatar: '/professional-male-2.jpg',
    lab: 'SQL Injection - Level 1',
    time: '10 minutes ago',
  },
  {
    user: 'Eve',
    avatar: '/professional-woman-director.png',
    lab: 'XSS Basic - Reflected',
    time: '25 minutes ago',
  },
];

export function RecentActivity() {
  const [activeTab, setActiveTab] = useState('newUsers');

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <div className="flex border-b border-purple-500/30 mb-4">
        <button
          onClick={() => setActiveTab('newUsers')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'newUsers'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}>
          New Users
        </button>
        <button
          onClick={() => setActiveTab('recentSolves')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-300 ${
            activeTab === 'recentSolves'
              ? 'text-white border-b-2 border-purple-500'
              : 'text-gray-400 hover:text-white'
          }`}>
          Recent Solves
        </button>
      </div>

      <div>
        {activeTab === 'newUsers' && (
          <ul className="space-y-4">
            {newUsers.map((user, index) => (
              <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50 cursor-pointer">
                <div className="flex items-center">
                  <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full mr-4" />
                  <div>
                    <p className="font-semibold text-white">{user.name}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{user.time}</p>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'recentSolves' && (
           <ul className="space-y-4">
           {recentSolves.map((solve, index) => (
             <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700/50 cursor-pointer">
               <div className="flex items-center">
                 <Image src={solve.avatar} alt={solve.user} width={40} height={40} className="rounded-full mr-4" />
                 <div>
                   <p className="font-semibold text-white">{solve.user}</p>
                   <p className="text-sm text-gray-400">solved <span className='text-purple-400'>{solve.lab}</span></p>
                 </div>
               </div>
               <p className="text-xs text-gray-500">{solve.time}</p>
             </li>
           ))}
         </ul>
        )}
      </div>
    </div>
  );
}
