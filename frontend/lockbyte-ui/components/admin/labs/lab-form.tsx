"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { MoveIcon as RemoveIcon, Check } from "lucide-react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

// Type definitions
interface Tag {
  id: number
  name: string
}
interface LabData {
  id: number
  name: string
  description: string
  solution: string
  hint: string
  fixVulnerabilities: string
  dockerImage: string
  difficulty: string
  timeoutMinutes: number
  status: string
  tags: Tag[]
}
interface LabFormProps {
  mode?: "create" | "edit"
  initialData?: LabData
}

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

// Markdown Editor Component
const MarkdownEditor = ({ value, onChange }: MarkdownEditorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 p-4 border-2 border-primary/40 rounded-xl bg-card/50 backdrop-blur-sm font-mono text-sm text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/60 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
        placeholder="Enter markdown content here...\n\nExample for image: ![Alt text](image_url)"
      />
      <div
        className="prose prose-invert max-w-none p-4 border-2 border-primary/40 rounded-xl bg-card/50 backdrop-blur-sm overflow-auto h-96 shadow-[0_0_15px_rgba(99,102,241,0.1)] font-mono text-sm text-white"
      >
        <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>{value}</ReactMarkdown>
      </div>
    </div>
  )
}

// Main Lab Form Component
export function LabForm({ mode = "create", initialData }: LabFormProps) {
  const router = useRouter()

  // Form State
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [solution, setSolution] = useState("")
  const [hint, setHint] = useState("")
  const [fixVulnerabilities, setFixVulnerabilities] = useState("")
  const [dockerImage, setDockerImage] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [timeoutMinutes, setTimeoutMinutes] = useState(60)
  const [status, setStatus] = useState("Draft")

  // Tags State
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isTagsPopoverOpen, setTagsPopoverOpen] = useState(false)

  // Fetch all tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/tags`
        const res = await fetch(apiUrl, { credentials: "include" })
        if (res.ok) setAllTags(await res.json())
        else toast.error("Failed to load tags.")
      } catch {
        toast.error("Failed to load tags.")
      }
    }
    fetchTags()
  }, [])

  // Populate form if in edit mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "")
      setDescription(initialData.description || "")
      setSolution(initialData.solution || "")
      setHint(initialData.hint || "")
      setFixVulnerabilities(initialData.fixVulnerabilities || "")
      setDockerImage(initialData.dockerImage || "")
      setDifficulty(initialData.difficulty || "Easy")
      setTimeoutMinutes(initialData.timeoutMinutes || 60)
      setStatus(initialData.status || "Draft")
      setSelectedTags(initialData.tags || [])
    }
  }, [initialData])

  // Tag selection handlers
  const handleTagSelect = useCallback((tag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag],
    )
    setTagsPopoverOpen(false)
  }, [])

  const handleTagRemove = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId))
  }

  // Form submission handler
  const handleSubmit = async () => {
    if (mode === "edit" && !initialData) {
      toast.error("Cannot update lab without initial data.")
      return
    }

    const labData = {
      name,
      description,
      solution,
      hint,
      fixVulnerabilities,
      dockerImage,
      difficulty,
      timeoutMinutes,
      status,
      tagIds: selectedTags.map((t) => t.id),
    }

    const isEdit = mode === "edit"
    const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/labs`
    const url = isEdit ? `${baseUrl}/${initialData!.id}` : baseUrl
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(labData),
        credentials: "include",
      })
      if (res.ok) {
        toast.success(`Lab ${isEdit ? "updated" : "created"} successfully!`)
        router.push("/admin/labs")
        router.refresh()
      } else {
        const errorData = await res.json()
        toast.error(`Failed to ${isEdit ? "update" : "create"} lab: ${errorData.message || "Unknown error"}`)
      }
                } catch {
                toast.error(`An error occurred while submitting the lab.`)
              }  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Lab Name</CardTitle>
            <CardDescription className="text-white/70">
              This is the main title of the lab and will be displayed prominently.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              id="lab-name"
              placeholder="e.g., Reflected XSS into HTML context with nothing encoded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white">Content Editor</CardTitle>
            <CardDescription className="text-white/70">
              Use the tabs to edit the different markdown sections of the lab.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="description">
              <TabsList className="mb-4 bg-[#ffffff]/5 border border-[#ffffff]/20 rounded-xl">
                <TabsTrigger
                  value="description"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="solution"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
                >
                  Solution
                </TabsTrigger>
                <TabsTrigger
                  value="hint"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
                >
                  Hint
                </TabsTrigger>
                <TabsTrigger
                  value="fix"
                  className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
                >
                  How to Fix
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <MarkdownEditor value={description} onChange={setDescription} />
              </TabsContent>
              <TabsContent value="solution">
                <MarkdownEditor value={solution} onChange={setSolution} />
              </TabsContent>
              <TabsContent value="hint">
                <MarkdownEditor value={hint} onChange={setHint} />
              </TabsContent>
              <TabsContent value="fix">
                <MarkdownEditor value={fixVulnerabilities} onChange={setFixVulnerabilities} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1">
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
          <CardHeader>
            <CardTitle className="text-white text-xl font-bold">Settings & Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white font-medium">
                  Status
                </Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status" className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                    <SelectItem value="Draft" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Draft
                    </SelectItem>
                    <SelectItem value="Published" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Published
                    </SelectItem>
                    <SelectItem value="Archived" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Archived
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-white font-medium">
                  Difficulty
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty" className="border-[#ffffff]/20 rounded-xl bg-[#ffffff]/5 text-white">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                    <SelectItem value="Easy" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Easy
                    </SelectItem>
                    <SelectItem value="Medium" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Medium
                    </SelectItem>
                    <SelectItem value="Hard" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Hard
                    </SelectItem>
                    <SelectItem value="Expert" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">
                      Expert
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white font-medium">Tags</Label>
              <Popover open={isTagsPopoverOpen} onOpenChange={setTagsPopoverOpen}>
                <PopoverTrigger asChild>
                  <div className="flex flex-wrap gap-2 p-2 border border-[#ffffff]/20 rounded-xl min-h-[40px] cursor-text items-center hover:border-[#9747ff]/50 transition-colors bg-[#ffffff]/5">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg"
                      >
                        {tag.name}
                        <button
                          onClick={() => handleTagRemove(tag.id)}
                          className="ml-1.5 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <RemoveIcon className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {selectedTags.length === 0 && <span className="text-white/40 text-sm">Select tags...</span>}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-(--radix-popover-trigger-width) p-0 bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
                  <Command>
                    <CommandInput placeholder="Search tags..." className="text-white" />
                    <CommandList>
                      <CommandEmpty className="text-white/70">No tags found.</CommandEmpty>
                      <CommandGroup>
                        {allTags.map((tag) => {
                          const isSelected = selectedTags.some((t) => t.id === tag.id)
                          return (
                            <CommandItem
                              key={tag.id}
                              onSelect={() => handleTagSelect(tag)}
                              className="hover:bg-[#9747ff]/10 rounded-lg text-white"
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                                )}
                              >
                                <Check className={cn("h-4 w-4")} />
                              </div>
                              {tag.name}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="docker-image" className="text-white font-medium">
                Docker Image
              </Label>
              <Input
                id="docker-image"
                placeholder="my-repo/sql-lab:latest"
                value={dockerImage}
                onChange={(e) => setDockerImage(e.target.value)}
                className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout" className="text-white font-medium">
                Timeout (minutes)
              </Label>
              <Input
                id="timeout"
                type="number"
                placeholder="e.g., 30"
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(Number.parseInt(e.target.value, 10) || 0)}
                className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-4 border-t border-[#ffffff]/20 pt-6">
            <Button
              type="button"
              onClick={() => setStatus("Draft")}
              className="bg-gradient-to-br from-[#ffffff]/5 via-[#9747ff]/5 to-[#5a5bed]/5 border border-[#ffffff]/10 text-white hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]"
            >
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 hover:from-[#9747ff]/30 hover:to-[#821db6]/20 text-white border border-[#9747ff]/40 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]"
            >
              {mode === "edit" ? "Save Changes" : "Publish Lab"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
