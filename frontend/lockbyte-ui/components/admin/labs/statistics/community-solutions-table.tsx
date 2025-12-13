"use client"

import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { ExternalLink, Check, X } from "lucide-react"

interface CommunitySolution {
  id: number
  status: "Rejected" | "Pending" | "Approved"
  writeup: string
  youtubeUrl: string
  labId: number
  userId: number
  fullName: string
  feedback?: string
}

type SolutionToUpdate = {
  id: number
  fullName: string
  action: "approve" | "reject"
}

export function CommunitySolutionsTable({ labId }: { labId: string }) {
  const [solutions, setSolutions] = useState<CommunitySolution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [solutionToUpdate, setSolutionToUpdate] = useState<SolutionToUpdate | null>(null)
  const [adminFeedback, setAdminFeedback] = useState("")

  const fetchSolutions = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lab/community-solutions/${labId}`, { credentials: "include" })
      if (!res.ok) throw new Error("Failed to fetch community solutions.")
      const responseData = await res.json()
      setSolutions(responseData.body || [])
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [labId])

  useEffect(() => {
    fetchSolutions()
  }, [fetchSolutions])

  const handleUpdateStatus = async () => {
    if (!solutionToUpdate) return

    const { id, action } = solutionToUpdate
    const approve = action === "approve"
    
    let url = `${process.env.NEXT_PUBLIC_API_URL}/lab/community-solutions/${id}?approve=${approve}`
    if (adminFeedback) {
      url += `&adminFeedback=${encodeURIComponent(adminFeedback)}`
    }

    try {
      const res = await fetch(url, {
        method: "PUT",
        credentials: "include",
      })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.body || "Failed to update status.")
      }
      const successMessage = await res.json()
      toast.success(successMessage.body || "Status updated successfully!")
      fetchSolutions() // Refresh data
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred."
      toast.error(errorMessage)
    } finally {
      setSolutionToUpdate(null)
      setAdminFeedback("")
    }
  }

  const getStatusBadge = (status: CommunitySolution["status"]) => {
    switch (status) {
      case "Approved":
        return <Badge variant="outline" className="bg-green-600/30 text-green-200 border-green-600/50">Approved</Badge>
      case "Rejected":
        return <Badge variant="outline" className="bg-red-600/30 text-red-200 border-red-600/50">Rejected</Badge>
      case "Pending":
        return <Badge variant="outline" className="bg-yellow-600/30 text-yellow-200 border-yellow-600/50">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return <div className="text-white">Loading community solutions...</div>
  }

  if (error) {
    return <div className="text-red-400">Error: {error}</div>
  }

  return (
    <>
      <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm p-6 rounded-xl border border-[#ffffff]/10 h-full shadow-[0_0_15px_rgba(151,71,255,0.15)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(151,71,255,0.3)]">
        <h3 className="text-lg font-semibold text-white mb-4">Community Solutions</h3>
        {solutions.length === 0 ? (
          <p className="text-white/70">No community solutions submitted for this lab yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10">
                  <TableHead className="text-white font-semibold">User</TableHead>
                  <TableHead className="text-white font-semibold">Write-up</TableHead>
                  <TableHead className="text-white font-semibold">YouTube</TableHead>
                  <TableHead className="text-white font-semibold">Status</TableHead>
                  <TableHead className="text-white font-semibold">Feedback</TableHead>
                  <TableHead className="text-white font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.map((solution) => (
                  <TableRow key={solution.id} className="border-b border-white/10 hover:bg-white/5">
                    <TableCell className="font-medium text-white/90">{solution.fullName}</TableCell>
                    <TableCell>
                      <a href={solution.writeup} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        View <ExternalLink size={14} />
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={solution.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                        Watch <ExternalLink size={14} />
                      </a>
                    </TableCell>
                    <TableCell>{getStatusBadge(solution.status)}</TableCell>
                    <TableCell className="text-sm text-white/80">{solution.feedback || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:bg-green-500/10 hover:text-green-300 mr-2"
                        onClick={() => setSolutionToUpdate({ id: solution.id, fullName: solution.fullName, action: "approve" })}
                        disabled={solution.status === 'Approved'}
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        onClick={() => setSolutionToUpdate({ id: solution.id, fullName: solution.fullName, action: "reject" })}
                        disabled={solution.status === 'Rejected'}
                      >
                        <X size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!solutionToUpdate} onOpenChange={() => setSolutionToUpdate(null)}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-sm border-[#ffffff]/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to {solutionToUpdate?.action} the solution from{" "}
              <span className="font-bold text-amber-400">{solutionToUpdate?.fullName}</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {solutionToUpdate?.action && (
            <div className="my-4">
              <label htmlFor="feedback" className="text-sm font-medium text-white/90 mb-2 block">Feedback (Optional)</label>
              <Textarea
                id="feedback"
                placeholder={`Provide a reason for ${solutionToUpdate.action === 'approve' ? 'approval' : 'rejection'}...`}
                value={adminFeedback}
                onChange={(e) => setAdminFeedback(e.target.value)}
                className="bg-slate-800/60 border-slate-700 text-white"
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setSolutionToUpdate(null)}
              className="bg-transparent text-white hover:bg-white/10 border-white/20"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdateStatus}
              className={solutionToUpdate?.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              Confirm {solutionToUpdate?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
