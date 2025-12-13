"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2, Search, X, Check, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tag {
  id: number
  name: string
}

interface Lab {
  id: number
  name: string
  difficulty: string
  status: "Published" | "Draft" | "Archived"
  authorName: string
  tags: Tag[]
}

const StatusBadge = ({ status }: { status: Lab["status"] }) => {
  const statusStyles = {
    Published: "bg-green-500/80 text-white border-transparent",
    Draft: "bg-red-500/80 text-white border-transparent",
    Archived: "bg-gray-500/80 text-white border-transparent",
  } as const

  return <Badge className={cn("text-xs", statusStyles[status])}>{status}</Badge>
}

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | Lab["status"]>("All")

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagPopoverOpen, setTagPopoverOpen] = useState(false)
  const [tagQuery, setTagQuery] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const labsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/labs?page=0&size=100`
        const labsRes = await fetch(labsApiUrl, { credentials: "include" })
        if (!labsRes.ok) throw new Error("Failed to fetch labs. Are you logged in?")
        const labsData = await labsRes.json()
        setLabs(labsData.content ?? [])

        const tagsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/tags`
        const tagsRes = await fetch(tagsApiUrl)
        if (!tagsRes.ok) throw new Error("Failed to fetch tags.")
        const tagsData = await tagsRes.json()
        setAllTags(Array.isArray(tagsData) ? tagsData : [])
      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredLabs = useMemo(() => {
    const st = searchTerm.trim().toLowerCase()
    return labs
      .filter((lab) => lab.name.toLowerCase().includes(st))
      .filter((lab) => statusFilter === "All" || lab.status === statusFilter)
      .filter((lab) => {
        if (selectedTags.length === 0) return true
        return selectedTags.every((t) => lab.tags.some((lt) => lt.name === t))
      })
  }, [labs, searchTerm, statusFilter, selectedTags])

  const filteredTags = useMemo(() => {
    const q = tagQuery.trim().toLowerCase()
    if (!q) return allTags
    return allTags.filter((t) => t.name.toLowerCase().includes(q))
  }, [allTags, tagQuery])

  const handleTagToggle = (tagName: string) => {
    // Debug đúng chỗ: nếu click ăn thì sẽ log ra
    // console.log("[TagToggle]", tagName)

    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("All")
    setSelectedTags([])
    setTagQuery("")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Labs</h1>
          <p className="text-white/70">Manage all the labs on the platform.</p>
        </div>

        <Link href="/admin/labs/create">
          <Button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-white border-2 border-primary/40 hover:border-primary/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
            <PlusCircle className="h-5 w-5 text-primary" />
            Create Lab
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
          <Input
            placeholder="Search labs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/5 border-white/20 rounded-xl text-white"
          />
        </div>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "All" | Lab["status"])}>
          <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/20 rounded-xl text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Tags Popover - click guaranteed */}
        <Popover open={isTagPopoverOpen} onOpenChange={setTagPopoverOpen}>
          <PopoverTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="flex flex-wrap gap-2 p-2 border border-white/20 rounded-xl min-h-[40px]
                         items-center bg-white/5 transition-colors hover:border-[#9747ff]/50
                         w-full md:w-auto md:min-w-[220px]
                         focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9747ff]/30 focus-visible:border-[#9747ff]/45"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setTagPopoverOpen(true)
              }}
            >
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleTagToggle(tag)
                      }}
                      className="ml-1.5 rounded-full outline-none"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-white/40 text-sm px-2">Filter by tags...</span>
              )}
            </div>
          </PopoverTrigger>

          <PopoverContent className="w-[260px] p-2">
            <div className="flex items-center gap-2 px-2 pb-2 border-b border-white/10">
              <Search className="h-4 w-4 text-white/50" />
              <Input
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                placeholder="Search tags..."
                className="h-9 bg-transparent border-white/10 text-white placeholder:text-white/50 focus:border-[#9747ff]/45"
              />
            </div>

            <div className="max-h-64 overflow-auto p-1">
              {filteredTags.length === 0 ? (
                <div className="py-8 text-center text-sm text-white/60">No tags found.</div>
              ) : (
                filteredTags.map((tag) => {
                  const active = selectedTags.includes(tag.name)
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagToggle(tag.name)}
                      className={cn(
                        "w-full flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-left transition-colors",
                        "hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:outline-none",
                        active ? "bg-[#9747ff]/10" : ""
                      )}
                    >
                      <Check className={cn("h-4 w-4", active ? "opacity-100" : "opacity-0")} />
                      <span className="text-white">{tag.name}</span>
                    </button>
                  )
                })
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" onClick={clearFilters} className="text-white/70 hover:text-white">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      {isLoading && <p className="text-white">Loading labs...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {!isLoading && !error && (
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-white font-semibold">Lab Name</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Tags</TableHead>
                <TableHead className="text-white font-semibold">Author</TableHead>
                <TableHead className="text-right text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredLabs.map((lab) => (
                <TableRow key={lab.id} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{lab.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={lab.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {lab.tags.map((t) => (
                        <Badge
                          key={t.id}
                          variant="secondary"
                          className="bg-primary/10 text-white/60 border border-primary/30 rounded-md text-xs"
                        >
                          {t.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">{lab.authorName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/labs/statistics/${lab.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 hover:text-white rounded-lg"
                          aria-label="View Lab Statistics"
                        >
                          <BarChart className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Link href={`/admin/labs/edit/${lab.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/10 hover:text-white rounded-lg"
                          aria-label="Edit Lab"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg"
                        aria-label="Delete Lab"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
