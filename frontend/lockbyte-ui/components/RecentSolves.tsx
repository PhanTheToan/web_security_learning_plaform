"use client";

import { useMemo } from "react";
import { format, formatDistanceToNow } from 'date-fns';
import { Flag } from "lucide-react";
import Image from 'next/image';

interface RecentSolve {
  fullName: string;
  lastSolvedDate: string;
}

interface RecentSolvesProps {
  solves: RecentSolve[];
}

const RecentSolves = ({ solves }: RecentSolvesProps) => {
  const groupedSolves = useMemo(() => {
    if (!solves) return {};

    return solves.reduce((acc, solve) => {
      const date = new Date(solve.lastSolvedDate);
      const dateKey = format(date, 'dd MMMM yyyy');

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(solve);
      return acc;
    }, {} as Record<string, RecentSolve[]>);

  }, [solves]);

  if (!solves || solves.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 sm:p-8"> {/* Added background div */}
        <p className="text-[20px] text-white mt-[26px] mb-[16px] font-bold">The Hackativity</p>
        <p className="text-sm text-[#CFCFD4] mb-[32px]">Check what all users have been up to with this Challenge recently.</p>

        {Object.keys(groupedSolves).map(date => (
          <div key={date} className="mb-5">
            <p className="font-semibold text-gray-80 mb-5">{date}</p>
            {groupedSolves[date].map((solve, index) => (
              <div key={index} className="flex mb-8 items-center">
                <div className="mr-[12px] w-[48px] h-[48px] flex-shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#888693]/20 flex items-center justify-center">
                    <Flag className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/8 sm:flex justify-between items-center px-4 py-2 w-full">
                  <div className="flex items-center">
                    <Image className="rounded-full h-8 w-8 mr-3" src="/avatar.png" alt="avatar" width={32} height={32} />
                    <span className="text-[16px] text-white mr-[16px]">{solve.fullName}</span>
                    <span className="text-[12px] text-[#888693] mr-[16px]">solved this challenge</span>
                  </div>
                  <span className="text-[12px] text-[#888693] pr-[12px]">
                    {formatDistanceToNow(new Date(solve.lastSolvedDate), { addSuffix: true })}
                  </span>
                </div>

                {/* Mobile View */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/8 flex flex-col px-4 py-2 w-full sm:hidden">                  <div className="flex items-center mb-3">
                  <Image className="rounded-full h-8 w-8 mr-[12px] cursor-pointer" src="/avatar.png" alt="avatar" width={32} height={32} />
                  <span className="text-[16px] text-white">{solve.fullName}</span>
                </div>
                  <div className="flex justify-between">
                    <span className="text-[12px] text-[#888693]">solved this challenge</span>
                    <span className="text-[12px] text-[#888693]">
                      {formatDistanceToNow(new Date(solve.lastSolvedDate), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSolves;