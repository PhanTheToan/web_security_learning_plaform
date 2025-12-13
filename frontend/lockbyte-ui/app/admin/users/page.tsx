"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Pencil, Power } from "lucide-react"
import { cn } from "@/lib/utils"

type UserListItem = {
  id: number
  username: string
  fullName: string
  email: string
  status: "Active" | "Inactive"
  roles: string[]
}

type UsersApiResponse = {
  content: UserListItem[]
  totalPages: number
  number: number
}

const StatusBadge = ({ status }: { status: UserListItem["status"] }) => {
  const statusStyles = {
    Active: "bg-green-500/80 text-white border-transparent",
    Inactive: "bg-gray-500/80 text-white border-transparent",
  } as const
  return <Badge className={cn("text-xs", statusStyles[status])}>{status}</Badge>
}

export default function UsersListPage() {
  const [data, setData] = useState<UsersApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<number | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/users`
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
    fetchUsers()
  }, [])

  const handleStatusUpdate = async (userId: number) => {
    setIsUpdatingStatus(userId)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/users-status/${userId}`
      const res = await fetch(apiUrl, { method: "PUT", credentials: "include" })
      if (!res.ok) throw new Error(`Failed to update user status. Status: ${res.status}`)
      await fetchUsers()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error updating status")
    } finally {
      setIsUpdatingStatus(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Users</h1>
          <p className="text-white/70">Manage all the users on the platform.</p>
        </div>
        <Link href="/admin/users/create" passHref>
          <Button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-white border-2 border-primary/40 hover:border-primary/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
            <PlusCircle className="h-5 w-5 text-primary" />
            Create User
          </Button>
        </Link>
      </div>

      {loading && <p className="text-white">Loading users...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {data && (
        <Card className="bg-gradient-to-br from-[#ffffff]/8 via-[#9747ff]/5 to-[#5a5bed]/8 backdrop-blur-sm border border-[#ffffff]/10 rounded-xl">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10">
                <TableHead className="text-white font-semibold">Username</TableHead>
                <TableHead className="text-white font-semibold">Full Name</TableHead>
                <TableHead className="text-white font-semibold">Email</TableHead>
                <TableHead className="text-white font-semibold">Status</TableHead>
                <TableHead className="text-white font-semibold">Roles</TableHead>
                <TableHead className="text-right text-white font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.map((user) => (
                <TableRow key={user.id} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium text-white">{user.username}</TableCell>
                  <TableCell className="text-white/80">{user.fullName}</TableCell>
                  <TableCell className="text-white/80">{user.email}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles?.map(role => (
                        <Badge key={role} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Link href={`/admin/users/edit/${user.id}`} passHref>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white rounded-lg" aria-label="Edit User">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-yellow-500/20 hover:text-yellow-400 rounded-lg"
                        aria-label="Toggle Status"
                        disabled={isUpdatingStatus === user.id}
                        onClick={() => handleStatusUpdate(user.id)}
                      >
                        {isUpdatingStatus === user.id ? (
                          <span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
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
