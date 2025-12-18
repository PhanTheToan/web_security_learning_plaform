"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { MoveIcon as RemoveIcon, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import MarkdownEditor from "@/components/admin/shared/markdown-editor"
import { FileUploader } from "@/components/admin/shared/file-uploader"

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
  linkSource?: string
  flag?: string
}
interface LabFormProps {
  mode?: "create" | "edit"
  initialData?: LabData
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
  const [linkSource, setLinkSource] = useState("")
  const [flag, setFlag] = useState("")

  // Refs for markdown editors
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const solutionRef = useRef<HTMLTextAreaElement>(null);
  const hintRef = useRef<HTMLTextAreaElement>(null);
  const fixRef = useRef<HTMLTextAreaElement>(null);

  // Tags State
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isTagsPopoverOpen, setTagsPopoverOpen] = useState(false)

  // ✅ Search trong popover
  const [tagQuery, setTagQuery] = useState("")

  const filteredTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase()
    if (!q) return allTags
    return allTags.filter((t) => t.name.toLowerCase().includes(q))
  }, [allTags, tagQuery])

  

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
      setLinkSource(initialData.linkSource || "")
      setFlag(initialData.flag || "")
    }
  }, [initialData])

  // Tag selection handlers
  const handleTagSelect = useCallback((tag: Tag) => {
  setSelectedTags((prev) =>
    prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]
  )
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
      linkSource,
      flag,
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

        toast({
          title: `${isEdit ? "Cập nhật" : "Tạo mới"} thành công!`,
          description: `Lab ${isEdit ? "updated" : "created"} successfully!`,
        })
        router.push("/admin/labs")
        router.refresh()
      } else {
        if (res.status === 401) {
          toast({
            title: "Tạo lab mới không thành công",
            description: "Yêu cầu nhập đầy đủ các trường yêu cầu trước khi tạo lab mới",
            variant: "destructive",
          })
        } else {
          const errorData = await res.json()
          toast({
            title: `Failed to ${isEdit ? "update" : "create"} lab`,
            description: errorData.message || "Unknown error",
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "An error occurred while submitting the lab.",
        variant: "destructive",
      })
    }
  }

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
                <MarkdownEditor value={description} onChange={setDescription} textareaRef={descriptionRef} />
              </TabsContent>
              <TabsContent value="solution">
                <MarkdownEditor value={solution} onChange={setSolution} textareaRef={solutionRef} />
              </TabsContent>
              <TabsContent value="hint">
                <MarkdownEditor value={hint} onChange={setHint} textareaRef={hintRef} />
              </TabsContent>
              <TabsContent value="fix">
                <MarkdownEditor value={fixVulnerabilities} onChange={setFixVulnerabilities} textareaRef={fixRef} />
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
                  {/* ✅ Dùng div role=button để tránh nested button bên trong Badge */}
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex flex-wrap gap-2 p-2 border border-white/20 rounded-xl min-h-[40px]
                              items-center bg-white/5 transition-colors hover:border-[#9747ff]/50
                              focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9747ff]/30 focus-visible:border-[#9747ff]/45"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") setTagsPopoverOpen(true)
                    }}
                  >
                    {selectedTags.length > 0 ? (
                      selectedTags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          className="bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg"
                        >
                          {tag.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleTagRemove(tag.id)
                            }}
                            className="ml-1.5 rounded-full outline-none"
                            aria-label={`Remove tag ${tag.name}`}
                          >
                            <RemoveIcon className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-white/40 text-sm px-2">Select tags...</span>
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                  <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10">
                    <Input
                      value={tagQuery}
                      onChange={(e) => setTagQuery(e.target.value)}
                      placeholder="Search tags..."
                      className="h-9 bg-transparent border-white/10 text-white placeholder:text-white/50 focus:border-[#9747ff]/45"
                    />
                  </div>

                  {/* List */}
                  <div className="max-h-64 overflow-auto p-1">
                    {filteredTags.length === 0 ? (
                      <div className="py-8 text-center text-sm text-white/60">No tags found.</div>
                    ) : (
                      filteredTags.map((tag) => {
                        const isSelected = selectedTags.some((t) => t.id === tag.id)

                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => handleTagSelect(tag)}
                            className={cn(
                              "w-full flex items-center gap-2 rounded-2xl px-2 py-2 text-sm text-left transition-colors",
                              "hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:outline-none",
                              isSelected ? "bg-[#9747ff]/10" : ""
                            )}
                          >
                            <Check className={cn("h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                            <span className="text-white">{tag.name}</span>
                          </button>
                        )
                      })
                    )}
                  </div>
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
              <Label htmlFor="link-source" className="text-white font-medium">
                Link Source
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="link-source"
                  placeholder="e.g., https://example.com/source.zip"
                  value={linkSource}
                  onChange={(e) => setLinkSource(e.target.value)}
                  className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
                />
              </div>
              <FileUploader />
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
            <div className="space-y-2">
              <Label htmlFor="flag" className="text-white font-medium">
                Flag
              </Label>
              <Input
                id="flag"
                placeholder="e.g., CYLOCK{FAKE_FLAG_FAKE_FLAG}"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-end gap-4 border-t border-[#ffffff]/20 pt-6">
            <Button
              type="button"
              onClick={handleSubmit}
              className="bg-gradient-to-br from-[#9747ff]/20 to-[#5a5bed]/10 hover:from-[#9747ff]/30 hover:to-[#821db6]/20 text-white border border-[#9747ff]/40 hover:border-[#9747ff]/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]"
            >
              {mode === "edit" ? "Save Changes" : "Save Lab"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
