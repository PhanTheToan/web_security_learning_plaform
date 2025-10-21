"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type Tag = {
  id: number
  name: string
}

type TopicListItem = {
  id: number
  title: string
  status: "Published" | "Draft" | "Archived"
  authorName: string
  tags: Tag[]
}

type TopicsApiResponse = {
  content: TopicListItem[]
  totalPages: number
  number: number
}

const StatusBadge = ({ status }: { status: TopicListItem["status"] }) => {
  const statusStyles = {
    Published: "bg-green-500/80 text-white border-transparent",
    Draft: "bg-yellow-500/80 text-white border-transparent",
    Archived: "bg-gray-500/80 text-white border-transparent",
  } as const
  return <Badge className={cn("text-xs", statusStyles[status])}>{status}</Badge>
}

export default function TopicsListPage() {
  const [data, setData] = useState<TopicsApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)

  const fetchTopics = async () => {
    setLoading(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/topics`
      const res = await fetch(apiUrl, { credentials: "include", cache: "no-store" })
      if (!res.ok) throw new Error(`Failed with ${res.status}. Are you logged in?`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  const handleDeleteTopic = async (topicId: number) => {
    setIsDeleting(topicId)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/topics/${topicId}`
      const res = await fetch(apiUrl, { method: "DELETE", credentials: "include" })
      if (!res.ok) throw new Error(`Failed to delete topic. Status: ${res.status}`)
      // Refresh the list after successful deletion
      await fetchTopics()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error deleting topic")
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Topics</h1>
          <p className="text-white/70">Manage all the topics on the platform.</p>
        </div>
        <Link href="/admin/topics/create" passHref>
          <Button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-white border-2 border-primary/40 hover:border-primary/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
            <PlusCircle className="h-5 w-5 text-primary" />
            Create Topic
          </Button>
        </Link>
      </div>

      {loading && <p className="text-white">Loading topics...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {data && (
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-white font-semibold">Title</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Author</TableHead>
                <TableHead className="text-white font-semibold">Tags</TableHead>
                <TableHead className="text-right text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.map((topic) => (
                <TableRow key={topic.id} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{topic.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={topic.status} />
                  </TableCell>
                  <TableCell className="text-white/80">{topic.authorName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {topic.tags?.map(tag => (
                        <Badge key={tag.id} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/topics/edit/${topic.id}`} passHref>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white rounded-lg" aria-label="Edit Topic">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg"
                            aria-label="Delete Topic"
                            disabled={isDeleting === topic.id}
                          >
                            {isDeleting === topic.id ? (
                              <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the topic.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTopic(topic.id)}>
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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