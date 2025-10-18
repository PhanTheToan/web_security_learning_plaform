"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XIcon, SearchIcon, LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import MarkdownEditor from "@/components/admin/shared/markdown-editor";
import { FileUploader } from "@/components/admin/shared/file-uploader";
import { getAdminLabs, createAdminTopic, updateAdminTopic } from "@/lib/api";
import { Lab, Topic } from "@/types/topic";

interface TopicFormData {
  title: string;

  content: string;
  status: 'Draft' | 'Published' | 'Archived';
  labs: Lab[];
}

export function TopicForm({ initialData }: { initialData?: Topic | null }) {
  const router = useRouter();
  // const { toast } = useToast();
  const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = useForm<TopicFormData>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      status: initialData?.status || "Draft",
      labs: initialData?.labs || [],
    },
  });

  const [allLabs, setAllLabs] = useState<Lab[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const relatedLabs = watch('labs');

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const labsData = await getAdminLabs();
        setAllLabs(labsData);
      } catch (error) {
        console.error("Failed to fetch labs", error);
        // toast({ title: "Error", description: "Could not fetch labs.", variant: "destructive" });
      }
    };
    fetchLabs();
  }, []);

  useEffect(() => {
    if (initialData) {
      setValue('title', initialData.title);
      setValue('content', initialData.content);
      setValue('status', initialData.status);
      setValue('labs', initialData.labs);
    }
  }, [initialData, setValue]);

  const filteredLabs = searchQuery
    ? allLabs.filter(lab => lab.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleAddLab = (labToAdd: Lab) => {
    if (!relatedLabs.some(lab => lab.id === labToAdd.id)) {
      setValue('labs', [...relatedLabs, labToAdd]);
    }
    setSearchQuery("");
    setIsPopoverOpen(false);
  };

  const removeLab = (labToRemove: Lab) => {
    setValue('labs', relatedLabs.filter(lab => lab.id !== labToRemove.id));
  };

  const handleInsertLabLink = (lab: { id: number; name: string }) => {
    if (!textareaRef.current) return;
    const currentContent = watch('content');
    const cursorPosition = textareaRef.current.selectionStart;
    const markdownLink = `[${lab.name}](/labs/${lab.id})`;
    const newText =
      currentContent.substring(0, cursorPosition) +
      markdownLink +
      currentContent.substring(cursorPosition);
    setValue('content', newText);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const onSubmit = async (data: TopicFormData) => {
    const payload = {
      title: data.title,
      content: data.content,
      status: data.status,
      labsId: data.labs.map(l => l.id),
    };

    try {
      if (initialData) {
        await updateAdminTopic(String(initialData.id), payload);
        // toast({ title: "Success", description: "Topic updated successfully!" });
      } else {
        await createAdminTopic(payload);
        // toast({ title: "Success", description: "Topic created successfully!" });
      }
      router.push('/admin/topics');
      router.refresh(); // To reflect changes in the list
    } catch (error) {
      console.error("Failed to save topic", error);
      // toast({ title: "Error", description: "Failed to save topic.", variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Main Content */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Topic Title</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              id="title"
              placeholder="Enter topic title"
              className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-red-400 text-sm mt-2">{errors.title.message}</p>}
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="content"
              control={control}
              rules={{ required: "Content is required" }}
              render={({ field }) => (
                <MarkdownEditor
                  value={field.value}
                  onChange={field.onChange}
                  textareaRef={textareaRef}
                  height="min-h-[400px]"
                />
              )}
            />
            {errors.content && <p className="text-red-400 text-sm mt-2">{errors.content.message}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Metadata and Actions */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Publish</CardTitle>
          </CardHeader>
          <CardContent>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="status" className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-4 border-t border-[#ffffff]/20 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 hover:from-[#9747ff]/30 hover:to-[#821db6]/20 text-white border border-[#9747ff]/40 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl"
            >
              {isSubmitting ? 'Saving...' : (initialData ? 'Update Topic' : 'Create Topic')}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">File Uploader</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUploader />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Link Related Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative mb-2">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    placeholder="Search labs to add..."
                    className="pl-9 border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                <Command>
                  <CommandList>
                    {filteredLabs.length === 0 && searchQuery.trim() !== '' && (
                      <CommandEmpty className="text-white/70 p-2">No labs found.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {filteredLabs.map((lab) => (
                        <CommandItem
                          key={lab.id}
                          onSelect={() => handleAddLab(lab)}
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
            <div className="flex flex-wrap gap-2 mt-2">
              {relatedLabs.map((lab) => (
                <Badge key={lab.id} variant="secondary" className="flex items-center gap-2 pl-2 pr-1 bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg">
                  {lab.name}
                  <button type="button" onClick={() => handleInsertLabLink(lab)} className="p-1 rounded-full hover:bg-white/20" title={`Insert link`}>
                    <LinkIcon className="h-3 w-3" />
                  </button>
                  <button type="button" onClick={() => removeLab(lab)} className="p-1 rounded-full hover:bg-white/20" title={`Remove`}>
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
