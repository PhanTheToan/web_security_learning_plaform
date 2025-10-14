"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2, Search, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Type Definitions
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

// Helper component for status-specific badges
const StatusBadge = ({ status }: { status: Lab["status"] }) => {
  const statusStyles = {
    Published: "bg-green-500/80 text-white border-transparent",
    Draft: "bg-red-500/80 text-white border-transparent",
    Archived: "bg-gray-500/80 text-white border-transparent",
  } as const;
  return <Badge className={cn("text-xs", statusStyles[status])}>{status}</Badge>;
};

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagPopoverOpen, setTagPopoverOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Labs
        const labsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/labs?page=0&size=100`
        const labsRes = await fetch(labsApiUrl, { credentials: "include" })
        if (!labsRes.ok) throw new Error("Failed to fetch labs. Are you logged in?")
        const labsData = await labsRes.json()
        setLabs(labsData.content)

        // Fetch Tags
        const tagsApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/public/tags`
        const tagsRes = await fetch(tagsApiUrl)
        if (!tagsRes.ok) throw new Error("Failed to fetch tags.")
        const tagsData = await tagsRes.json()
        setAllTags(tagsData)

      } catch (e) {
        setError(e instanceof Error ? e.message : "An unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredLabs = useMemo(() => {
    return labs
      .filter(lab => 
        lab.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(lab => 
        statusFilter === "All" || lab.status === statusFilter
      )
      .filter(lab => 
        selectedTags.length === 0 || selectedTags.every(tag => lab.tags.some(labTag => labTag.name === tag))
      )
  }, [labs, searchTerm, statusFilter, selectedTags])

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev => 
      prev.includes(tagName) 
        ? prev.filter(t => t !== tagName) 
        : [...prev, tagName]
    )
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("All")
    setSelectedTags([])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Labs</h1>
          <p className="text-white/70">Manage all the labs on the platform.</p>
        </div>
        <Link href="/admin/labs/create" passHref>
          <Button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-white border-2 border-primary/40 hover:border-primary/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
            <PlusCircle className="h-5 w-5 text-primary" />
            Create Lab
          </Button>
        </Link>
      </div>

      {/* Filter Section */}
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-white/5 border-white/20 rounded-xl text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
            <SelectItem value="All" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">All Statuses</SelectItem>
            <SelectItem value="Published" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">Published</SelectItem>
            <SelectItem value="Draft" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">Draft</SelectItem>
            <SelectItem value="Archived" className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white focus:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] transition-all duration-200">Archived</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover open={isTagPopoverOpen} onOpenChange={setTagPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex flex-wrap gap-2 p-2 border border-[#ffffff]/20 rounded-xl min-h-[40px] cursor-text items-center hover:border-[#9747ff]/50 transition-colors bg-[#ffffff]/5 w-full md:w-auto md:min-w-[200px]">
              {selectedTags.length > 0 
                ? selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#9747ff]/20 text-white border-[#9747ff]/30 rounded-lg"
                    >
                      {tag}
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent popover from opening
                          handleTagSelect(tag);
                        }}
                        className="ml-1.5 rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                : <span className="text-white/40 text-sm px-2">Filter by tags...</span>
              }
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-card/95 backdrop-blur-sm border-[#ffffff]/20 rounded-xl">
            <Command>
              <CommandInput placeholder="Search tags..." className="h-9" />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {allTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      value={tag.name}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleTagSelect(tag.name);
                      }}
                      className="text-white hover:bg-[#9747ff]/10 focus:bg-[#9747ff]/10 focus:text-white"
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedTags.includes(tag.name) ? "opacity-100" : "opacity-0")} />
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
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
                      {lab.tags.map(tag => <Badge key={tag.id} variant="secondary" className="bg-primary/10 text-white/60 border border-primary/30 rounded-md text-xs">{tag.name}</Badge>)}
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">{lab.authorName}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/labs/edit/${lab.id}`} passHref>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white rounded-lg" aria-label="Edit Lab">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg" aria-label="Delete Lab">
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
