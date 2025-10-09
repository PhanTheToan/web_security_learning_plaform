import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export function QuickShortcuts() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Shortcuts</h3>
      <div className="space-y-4">
        <Button className="w-full justify-start text-left bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
          <Icons.PlusSquare className="w-5 h-5 mr-3" />
          Add New Lab
        </Button>
        <Button className="w-full justify-start text-left bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
          <Icons.BookOpen className="w-5 h-5 mr-3" />
          Add New Topic
        </Button>
        <Button className="w-full justify-start text-left bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
          <Icons.UsersGroup className="w-5 h-5 mr-3" />
          Manage Users
        </Button>
      </div>
    </div>
  );
}
