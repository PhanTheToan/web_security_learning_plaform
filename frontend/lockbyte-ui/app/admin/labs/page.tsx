"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"

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
    Published: "bg-green-500/30 text-white border-transparent",
    Draft: "bg-red-500/30 text-white border-transparent",
    Archived: "bg-gray-500/30 text-white border-transparent",
  } as const;
  return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/labs?page=0&size=20`
        const res = await fetch(apiUrl, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch labs. Are you logged in?")
        const data = await res.json()
        setLabs(data.content)
      } catch (e) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLabs()
  }, [])

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

      {isLoading && <p className="text-white">Loading labs...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <Card
              key={lab.id}
              className="flex flex-col group bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 hover:from-[#9747ff]/10 hover:via-[#5a5bed]/8 hover:to-[#821db6]/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(151,71,255,0.2)] hover:scale-[1.02] rounded-xl"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold leading-snug text-white">{lab.name}</CardTitle>
                  <StatusBadge status={lab.status} />
                </div>
              </CardHeader>
              <CardContent className="flex-grow space-y-4">
                <div className="text-sm text-white/70">
                  Author: <span className="text-primary font-medium">{lab.authorName}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lab.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-primary/10 text-white/60 border border-primary/30 hover:bg-primary/20 rounded-lg"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-primary/20 pt-4 flex justify-end items-center gap-2">
                <div className="text-sm text-muted-foreground transition-opacity duration-300 lg:opacity-0 group-hover:opacity-100 flex gap-2">
                  <Link href={`/admin/labs/edit/${lab.id}`} passHref>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 hover:text-primary rounded-lg"
                      aria-label="Edit Lab"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-lg"
                    aria-label="Delete Lab"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
