"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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
import { Label } from "@/components/ui/label";
import { FileUploader } from "@/components/admin/shared/file-uploader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import MarkdownEditor from "@/components/admin/shared/markdown-editor";
import {
  createAdminTopic,
  updateAdminTopic,
  searchAdminLabs,
  searchAdminTags,
} from "@/lib/api";
import { Lab, Tag, Topic } from "@/types/topic";
import { useDebounce } from "@/hooks/use-debounce";

interface TopicFormData {
  title: string;
  content: string;
  status: "Draft" | "Published" | "Archived";
  labs: Lab[];
  tags: Tag[];
  coverImage?: string;
}

export function TopicForm({ initialData }: { initialData?: Topic | null }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TopicFormData>({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      status: initialData?.status || "Draft",
      labs: initialData?.labs || [],
      tags: initialData?.tags || [],
      coverImage: initialData?.coverImage || "",
    },
  });

  const [labSearchQuery, setLabSearchQuery] = useState("");
  const [tagSearchQuery, setTagSearchQuery] = useState("");
  const [isLabPopoverOpen, setIsLabPopoverOpen] = useState(false);
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false);
  const [searchedLabs, setSearchedLabs] = useState<Lab[]>([]);
  const [searchedTags, setSearchedTags] = useState<Tag[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const tagInputRef = useRef<HTMLInputElement>(null);
  const labInputRef = useRef<HTMLInputElement>(null);

  const debouncedLabSearch = useDebounce(labSearchQuery, 300);
  const debouncedTagSearch = useDebounce(tagSearchQuery, 300);

  const relatedLabs = watch("labs");
  const relatedTags = watch("tags");

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("content", initialData.content);
      setValue("status", initialData.status);
      setValue("labs", initialData.labs || []);
      setValue("tags", initialData.tags || []);
      setValue("coverImage", initialData.coverImage || "");
    }
  }, [initialData, setValue]);

  const fetchSearchedLabs = useCallback(async (query: string) => {
    if (!query) {
      setSearchedLabs([]);
      return;
    }
    try {
      const { items } = await searchAdminLabs(query);
      setSearchedLabs(items);
    } catch (error) {
      console.error("Failed to search labs", error);
    }
  }, []);

  const fetchSearchedTags = useCallback(async (query: string) => {
    if (!query) {
      setSearchedTags([]);
      return;
    }
    try {
      const { items } = await searchAdminTags(query);
      setSearchedTags(items);
    } catch (error) {
      console.error("Failed to search tags", error);
    }
  }, []);

  useEffect(() => {
    fetchSearchedLabs(debouncedLabSearch);
  }, [debouncedLabSearch, fetchSearchedLabs]);

  useEffect(() => {
    fetchSearchedTags(debouncedTagSearch);
  }, [debouncedTagSearch, fetchSearchedTags]);

  const handleAddLab = (labToAdd: Lab) => {
    if (!relatedLabs.some((lab) => lab.id === labToAdd.id)) {
      setValue("labs", [...relatedLabs, labToAdd]);
    }
    setLabSearchQuery("");
    setIsLabPopoverOpen(false);
    // ✅ focus lại input để chọn tiếp (UX)
    setTimeout(() => labInputRef.current?.focus(), 0);
  };

  const removeLab = (labToRemove: Lab) => {
    setValue("labs", relatedLabs.filter((lab) => lab.id !== labToRemove.id));
  };

  const handleAddTag = (tagToAdd: Tag) => {
    if (!relatedTags.some((tag) => tag.id === tagToAdd.id)) {
      setValue("tags", [...relatedTags, tagToAdd]);
    }
    setTagSearchQuery("");
    setIsTagPopoverOpen(false);
    setTimeout(() => tagInputRef.current?.focus(), 0);
  };

  const removeTag = (tagToRemove: Tag) => {
    setValue("tags", relatedTags.filter((tag) => tag.id !== tagToRemove.id));
  };

  const handleInsertLabLink = (lab: { id: number; name: string }) => {
    if (!textareaRef.current) return;
    const currentContent = watch("content");
    const cursorPosition = textareaRef.current.selectionStart;
    const markdownLink = `[${lab.name}](/labs/${lab.id})`;
    const newText =
      currentContent.substring(0, cursorPosition) +
      markdownLink +
      currentContent.substring(cursorPosition);
    setValue("content", newText);
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  const onSubmit = async (data: TopicFormData) => {
    const payload = {
      title: data.title,
      content: data.content,
      status: data.status,
      labsId: data.labs.map((l) => l.id),
      tagId: data.tags.map((t) => t.id),
      coverImage: data.coverImage,
    };

    try {
      if (initialData) {
        await updateAdminTopic(String(initialData.id), payload);
      } else {
        await createAdminTopic(payload);
      }
      router.push("/admin/topics");
      router.refresh();
    } catch (error) {
      console.error("Failed to save topic", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-6"
    >
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
            {errors.title && (
              <p className="text-red-400 text-sm mt-2">{errors.title.message}</p>
            )}
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
                  labs={relatedLabs}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-400 text-sm mt-2">{errors.content.message}</p>
            )}
          </CardContent>
        </Card>
      </div>

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
                  <SelectTrigger
                    id="status"
                    className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white"
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
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
              {isSubmitting ? "Saving..." : initialData ? "Update Topic" : "Create Topic"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Cover Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="coverImage" className="text-white/80 mb-2 block">
                Image URL
              </Label>
              <Input
                id="coverImage"
                placeholder="Paste URL from uploader"
                className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
                {...register("coverImage")}
              />
            </div>
            <FileUploader />
          </CardContent>
        </Card>

        {/* ===================== TAGS (CHỈNH: gõ trực tiếp input) ===================== */}
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover
              modal={false}
              open={isTagPopoverOpen}
              onOpenChange={setIsTagPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className="relative mb-2">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    ref={tagInputRef}
                    placeholder="Search tags..."
                    className="pl-9 border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
                    value={tagSearchQuery}
                    onFocus={() => setIsTagPopoverOpen(true)}
                    onClick={() => setIsTagPopoverOpen(true)}
                    onChange={(e) => {
                      setTagSearchQuery(e.target.value);
                      if (!isTagPopoverOpen) setIsTagPopoverOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsTagPopoverOpen(false);
                    }}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1 bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                <div className="max-h-60 overflow-auto">
                  {searchedTags.length === 0 && tagSearchQuery.trim() !== "" ? (
                    <div className="text-white/70 p-2 text-sm">No tags found.</div>
                  ) : (
                    searchedTags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // ✅ giữ focus, không “ăn click”
                        onClick={() => handleAddTag(tag)}
                        className="w-full text-left px-2 py-2 rounded-lg text-white hover:bg-[#9747ff]/10 transition-colors"
                      >
                        {tag.name}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2 mt-2">
              {relatedTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1 pl-2 pr-1 bg-[#3b82f6]/20 text-white border-[#3b82f6]/30 rounded-lg"
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="p-1 rounded-full hover:bg-white/20"
                    title="Remove"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ===================== LABS (CHỈNH: gõ trực tiếp input) ===================== */}
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white">Link Related Labs</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover
              modal={false}
              open={isLabPopoverOpen}
              onOpenChange={setIsLabPopoverOpen}
            >
              <PopoverTrigger asChild>
                <div className="relative mb-2">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                  <Input
                    ref={labInputRef}
                    placeholder="Search labs to add..."
                    className="pl-9 border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
                    value={labSearchQuery}
                    onFocus={() => setIsLabPopoverOpen(true)}
                    onClick={() => setIsLabPopoverOpen(true)}
                    onChange={(e) => {
                      setLabSearchQuery(e.target.value);
                      if (!isLabPopoverOpen) setIsLabPopoverOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setIsLabPopoverOpen(false);
                    }}
                  />
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1 bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                <div className="max-h-60 overflow-auto">
                  {searchedLabs.length === 0 && labSearchQuery.trim() !== "" ? (
                    <div className="text-white/70 p-2 text-sm">No labs found.</div>
                  ) : (
                    searchedLabs.map((lab) => (
                      <button
                        key={lab.id}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()} // ✅ giữ focus, không “ăn click”
                        onClick={() => handleAddLab(lab)}
                        className="w-full text-left px-2 py-2 rounded-lg text-white hover:bg-[#9747ff]/10 transition-colors"
                      >
                        {lab.name}
                      </button>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex flex-wrap gap-2 mt-2">
              {relatedLabs.map((lab) => (
                <Badge
                  key={lab.id}
                  variant="secondary"
                  className="flex items-center gap-2 pl-2 pr-1 bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg"
                >
                  {lab.name}
                  <button
                    type="button"
                    onClick={() => handleInsertLabLink(lab)}
                    className="p-1 rounded-full hover:bg-white/20"
                    title="Insert link"
                  >
                    <LinkIcon className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeLab(lab)}
                    className="p-1 rounded-full hover:bg-white/20"
                    title="Remove"
                  >
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
