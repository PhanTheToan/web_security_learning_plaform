"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"

// Type definitions based on API responses
interface DockerImage {
  id: string
  idShort: string
  repoTags: string[]
  createdAt: string
  inUse: boolean
}

interface DockerContainer {
  containerId: string
  image: string
  lab: string
  port: number
  url: string
  status: string
  createdAt: string
}

type ItemToDelete = {
  id: string
  name: string
  type: "image" | "container"
}

// --- Confirmation Dialog Component ---
interface DeleteConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  item: ItemToDelete | null
}

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm, item }: DeleteConfirmationDialogProps) {
  const [confirmationText, setConfirmationText] = useState("")

  useEffect(() => {
    if (isOpen) {
      setConfirmationText("") // Reset on open
    }
  }, [isOpen])

  if (!item) return null

  const isConfirmationMatch = confirmationText === "delete"

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            This action cannot be undone. This will permanently stop and delete the {item.type}{" "}
            <span className="font-bold text-amber-400">{item.name}</span>.
            <br />
            Please type <strong className="text-red-500">delete</strong> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          placeholder="delete"
          className="my-2 border-[#ffffff]/20 focus-visible:border-[#9747ff]/60 focus-visible:ring-[#9747ff] rounded-xl bg-[#ffffff]/5 text-white placeholder:text-white/40"
        />
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="bg-transparent text-white hover:bg-white/10 border-white/20"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={!isConfirmationMatch}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-600/50"
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// --- Main Docker Manager Component ---
export function DockerManager() {
  const [images, setImages] = useState<DockerImage[]>([])
  const [containers, setContainers] = useState<DockerContainer[]>([])
  const [isLoading, setIsLoading] = useState({ images: true, containers: true })
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null)

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading((prev) => ({ ...prev, images: true }))
      try {
        const res = await fetch(`${apiBaseUrl}/lab/images`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch images.")
        const data = await res.json()
        setImages(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
      } finally {
        setIsLoading((prev) => ({ ...prev, images: false }))
      }
    }
  
    const fetchContainers = async () => {
      setIsLoading((prev) => ({ ...prev, containers: true }))
      try {
        const res = await fetch(`${apiBaseUrl}/lab/status`, { credentials: "include" })
        if (!res.ok) throw new Error("Failed to fetch containers.")
        const data = await res.json()
        setContainers(data)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "An unknown error occurred.")
      } finally {
        setIsLoading((prev) => ({ ...prev, containers: false }))
      }
    }

    fetchImages()
    fetchContainers()
  }, [apiBaseUrl])

  const handleOpenDialog = (id: string, name: string, type: "image" | "container") => {
    setItemToDelete({ id, name, type })
  }

  const handleCloseDialog = () => {
    setItemToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    if (itemToDelete.type === "image") {
      try {
        const res = await fetch(`${apiBaseUrl}/lab/images?image=${itemToDelete.id}`, {
          method: "DELETE",
          credentials: "include",
        })
        const result = await res.json()
        if (result.error) {
          throw new Error(result.error)
        }
        toast.success(result.message || `Image ${itemToDelete.name} deleted successfully.`)
        // Re-fetch images after deletion
        const resImages = await fetch(`${apiBaseUrl}/lab/images`, { credentials: "include" })
        if (!resImages.ok) throw new Error("Failed to fetch images after deletion.")
        const dataImages = await resImages.json()
        setImages(dataImages)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to delete image.")
      }
    } else if (itemToDelete.type === "container") {
      try {
        const res = await fetch(`${apiBaseUrl}/lab/containers/cleanup?containerIds=${itemToDelete.id}`, {
          method: "POST",
          credentials: "include",
        })
        const result = await res.json()
        if (result && result.length > 0) {
          const { success, message } = result[0]
          if (success) {
            toast.success(message || `Container ${itemToDelete.name} stopped successfully.`)
          } else {
            throw new Error(message)
          }
        }
        // Re-fetch containers after deletion
        const resContainers = await fetch(`${apiBaseUrl}/lab/status`, { credentials: "include" })
        if (!resContainers.ok) throw new Error("Failed to fetch containers after deletion.")
        const dataContainers = await resContainers.json()
        setContainers(dataContainers)
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to stop container.")
      }
    }

    handleCloseDialog()
  }

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString()

  const renderLoading = () => <p className="text-white/70 p-4">Loading data...</p>
  const renderEmpty = (text: string) => <p className="text-white/70 p-4">{text}</p>

  return (
    <>
      <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 hover:border-[#9747ff]/60 transition-all duration-300 rounded-xl shadow-[0_0_15px_rgba(151,71,255,0.15)]">
        <CardHeader>
          <CardTitle className="text-white">System Status</CardTitle>
          <CardDescription className="text-white/70">Manage running Docker images and containers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="containers">
            <TabsList className="mb-4 bg-[#ffffff]/5 border border-[#ffffff]/20 rounded-xl">
              <TabsTrigger
                value="containers"
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
              >
                Active Containers
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#9747ff]/20 data-[state=active]:to-[#5a5bed]/10 data-[state=active]:text-white rounded-lg text-white/70"
              >
                Docker Images
              </TabsTrigger>
            </TabsList>

            {/* Containers Tab */}
            <TabsContent value="containers">
              {isLoading.containers
                ? renderLoading()
                : containers.length > 0
                  ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-white/10">
                          <TableHead className="text-white">Container ID</TableHead>
                          <TableHead className="text-white">Image</TableHead>
                          <TableHead className="text-white">Lab</TableHead>
                          <TableHead className="text-white">URL</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Created At</TableHead>
                          <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {containers.map((c) => (
                          <TableRow key={c.containerId} className="border-b border-white/10 text-white/90">
                            <TableCell>{c.containerId.substring(0, 12)}</TableCell>
                            <TableCell>{c.image}</TableCell>
                            <TableCell>{c.lab}</TableCell>
                            <TableCell>
                              <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline"
                              >
                                {c.url}
                              </a>
                            </TableCell>
                            <TableCell>{c.status}</TableCell>
                            <TableCell>{formatDate(c.createdAt)}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  handleOpenDialog(c.containerId, c.containerId.substring(0, 12), "container")
                                }
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Stop
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                  : renderEmpty("No active containers found.")}
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images">
              {isLoading.images
                ? renderLoading()
                : images.length > 0
                  ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-white/10">
                          <TableHead className="text-white">Image ID</TableHead>
                          <TableHead className="text-white">Repository Tags</TableHead>
                          <TableHead className="text-white">Created At</TableHead>
                          <TableHead className="text-white">In Use</TableHead>
                          <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {images.map((img) => (
                          <TableRow key={img.id} className="border-b border-white/10 text-white/90">
                            <TableCell>{img.idShort}</TableCell>
                            <TableCell>{img.repoTags.join(", ")}</TableCell>
                            <TableCell>{formatDate(img.createdAt)}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  img.inUse
                                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                                    : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                                }
                              >
                                {img.inUse ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleOpenDialog(img.id, img.idShort, "image")}
                                disabled={img.inUse}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )
                  : renderEmpty("No Docker images found.")}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <DeleteConfirmationDialog
        isOpen={!!itemToDelete}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmDelete}
        item={itemToDelete}
      />
    </>
  )
}
