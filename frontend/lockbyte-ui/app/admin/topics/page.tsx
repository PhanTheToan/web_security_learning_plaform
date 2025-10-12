"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  FileEditIcon,
  TrashIcon,
  ViewIcon,
  PlusCircleIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const topics = [
  {
    id: "TOP001",
    title: "Introduction to SQL Injection",
    author: "AdminUser",
    createdAt: "2023-10-01",
    status: "Published",
  },
  {
    id: "TOP002",
    title: "Cross-Site Scripting (XSS) Explained",
    author: "JaneDoe",
    createdAt: "2023-09-25",
    status: "Published",
  },
  {
    id: "TOP003",
    title: "Understanding Cross-Site Request Forgery (CSRF)",
    author: "AdminUser",
    createdAt: "2023-09-20",
    status: "Draft",
  },
  {
    id: "TOP004",
    title: "Basics of Network Security",
    author: "JohnSmith",
    createdAt: "2023-09-15",
    status: "Archived",
  },
  {
    id: "TOP005",
    title: "Advanced Malware Analysis",
    author: "AdminUser",
    createdAt: "2023-09-10",
    status: "Published",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: { [key: string]: string } = {
    Published: "bg-green-500/80 text-white border-transparent",
    Draft: "bg-blue-500/80 text-white border-transparent",
    Archived: "bg-gray-500/80 text-white border-transparent",
  };
  return <Badge className={cn("text-xs", statusStyles[status])}>{status}</Badge>;
};

export default function TopicsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Topics</h1>
          <p className="text-white/70">Manage all the topics and articles.</p>
        </div>
        <Button asChild className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-white border-2 border-primary/40 hover:border-primary/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
          <Link href="/admin/topics/create">
            <PlusCircleIcon className="mr-2 h-5 w-5 text-primary" />
            Create New Topic
          </Link>
        </Button>
      </div>

      <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/10">
              <TableHead className="text-white font-semibold">ID</TableHead>
              <TableHead className="text-white font-semibold">Title</TableHead>
              <TableHead className="text-white font-semibold">Author</TableHead>
              <TableHead className="text-white font-semibold">Created At</TableHead>
              <TableHead className="text-white font-semibold">Status</TableHead>
              <TableHead className="text-right text-white font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topics.map((topic) => (
              <TableRow key={topic.id} className="border-b border-white/10 hover:bg-white/5">
                <TableCell className="font-medium text-white/80">{topic.id}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/topics/edit/${topic.id}`}
                    className="hover:underline font-semibold text-white"
                  >
                    {topic.title}
                  </Link>
                </TableCell>
                <TableCell className="text-white/80">{topic.author}</TableCell>
                <TableCell className="text-white/80">{topic.createdAt}</TableCell>
                <TableCell>
                  <StatusBadge status={topic.status} />
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-white/80 hover:bg-white/10 hover:text-white">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/topics/edit/${topic.id}`} className="cursor-pointer">
                          <FileEditIcon className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <ViewIcon className="mr-2 h-4 w-4" />
                        <span>Preview</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 cursor-pointer">
                        <TrashIcon className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
