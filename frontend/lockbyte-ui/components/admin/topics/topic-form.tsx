"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XIcon, SearchIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import MarkdownEditor from "@/components/admin/shared/markdown-editor";

// Mock data for labs and tags
const mockLabs = [
  { id: "LAB001", name: "SQL Injection Fundamentals" },
  { id: "LAB002", name: "XSS Attack Vectors" },
  { id: "LAB003", name: "CSRF Prevention Techniques" },
  { id: "LAB004", name: "File Upload Vulnerabilities" },
];

const mockTags = ["Web Basics", "Attack Vectors", "SQL", "XSS", "CSRF"];

export function TopicForm() {
  const [relatedLabs, setRelatedLabs] = useState([mockLabs[0]]);
  const [selectedTags, setSelectedTags] = useState([mockTags[0], mockTags[1]]);
  
  // State for Markdown Editor and Link Insertion
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [allLabs] = useState<any[]>(mockLabs);
  const [isLabPopoverOpen, setLabPopoverOpen] = useState(false);

  const removeLab = (lab: any) => {
    setRelatedLabs(relatedLabs.filter((l) => l.id !== lab.id));
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleInsertLabLink = (lab: { id: string; name: string }) => {
    if (!textareaRef.current) return;

    const cursorPosition = textareaRef.current.selectionStart;
    const currentText = content;
    const markdownLink = `[${lab.name}](/labs/${lab.id})`;

    const newText =
      currentText.substring(0, cursorPosition) +
      markdownLink +
      currentText.substring(cursorPosition);

    setContent(newText);
    setLabPopoverOpen(false);
    
    // Focus back on the textarea after insertion
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Topic Title</CardTitle>
            <CardDescription className="text-white/70">
              This is the main title of the topic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="title"
              placeholder="Enter topic title"
              className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
            />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
             <div className="flex items-center justify-between">
                <div>
                    <CardTitle className="text-white">Content</CardTitle>
                    <CardDescription className="text-white/70">
                        Use the editor to write the topic content and insert lab links.
                    </CardDescription>
                </div>
                <Popover open={isLabPopoverOpen} onOpenChange={setLabPopoverOpen}>
                    <PopoverTrigger asChild>
                        {/* This is a dummy trigger; the real one is inside MarkdownEditor */}
                        <span />
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0 bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                        <Command>
                            <CommandInput placeholder="Search labs to link..." className="text-white" />
                            <CommandList>
                                <CommandEmpty className="text-white/70">No labs found.</CommandEmpty>
                                <CommandGroup>
                                    {allLabs.map((lab) => (
                                        <CommandItem
                                            key={lab.id}
                                            onSelect={() => handleInsertLabLink(lab)}
                                            className="hover:bg-[#9747ff]/10 rounded-lg text-white cursor-pointer"
                                        >
                                            {lab.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              textareaRef={textareaRef}
              onInsertLabClick={() => setLabPopoverOpen(true)}
              height="min-h-[400px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Metadata and Actions */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Publish</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-white font-medium">Status</Label>
              <Select defaultValue="Draft">
                <SelectTrigger id="status" className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                  <SelectItem value="Draft" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white">Draft</SelectItem>
                  <SelectItem value="Published" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between gap-4 border-t border-[#ffffff]/20 pt-6">
             <Button
              variant="outline"
              className="bg-transparent hover:bg-white/10 border-white/20 hover:border-white/40 text-white rounded-xl"
            >
              Save Draft
            </Button>
            <Button className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 hover:from-[#9747ff]/30 hover:to-[#821db6]/20 text-white border border-[#9747ff]/40 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl">
              Publish
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Link Related Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input placeholder="Search labs..." className="pl-9 border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40" />
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedLabs.map((lab) => (
                <Badge key={lab.id} variant="secondary" className="flex items-center gap-1 bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg">
                  {lab.name}
                  <button onClick={() => removeLab(lab)}>
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-2">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input placeholder="Search tags..." className="pl-9 border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40" />
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg">
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
