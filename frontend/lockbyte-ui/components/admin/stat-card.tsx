import React from "react";
import { Icon } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  color: string;
}

export function StatCard({ icon: Icon, title, value, color }: StatCardProps) {
  const glowColor = `shadow-[0_0_15px_rgba(${color},0.4)]`;
  const borderColor = `border-purple-500/30`;
  const hoverBorderColor = `hover:border-purple-500/80`;

  return (
    <div
      className={`bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border ${borderColor} ${hoverBorderColor} transition-all duration-300 cursor-pointer group ${glowColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <Icon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
      </div>
    </div>
  );
}
