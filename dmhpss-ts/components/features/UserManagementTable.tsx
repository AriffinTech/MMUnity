"use client"

import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { updateUserRole, deleteUser } from "@/app/actions"
import { useRouter } from "next/navigation"

interface Profile {
    id: string
    full_name: string | null
    email: string
    role: 'user' | 'counselor' | 'moderator' | 'admin'
}

interface UserManagementTableProps {
    users: Profile[]
}

export function UserManagementTable({ users }: UserManagementTableProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState<string | null>(null)

    const handleRoleUpdate = async (userId: string, newRole: 'user' | 'counselor' | 'moderator' | 'admin') => {
        setIsLoading(userId)
        const result = await updateUserRole(userId, newRole)
        setIsLoading(null)

        if (result.error) {
            alert(result.error)
        } else {
            router.refresh()
        }
    }

    const handleDeleteUser = async (userId: string) => {
        if (!confirm("Are you sure you want to remove this user? This cannot be undone.")) return

        setIsLoading(userId)
        const result = await deleteUser(userId)
        setIsLoading(null)

        if (result.error) {
            alert(result.error)
        } else {
            router.refresh()
        }
    }

    return (
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-secondary/30 text-text-main font-semibold">
                    <tr>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50">
                            <td className="p-4 font-medium">{user.full_name || 'N/A'}</td>
                            <td className="p-4 text-muted-foreground">{user.email}</td>
                            <td className="p-4 capitalize">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                    user.role === 'counselor' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'moderator' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" disabled={isLoading === user.id}>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'user')}>
                                            Set as Student
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'counselor')}>
                                            Promote to Counselor
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'moderator')}>
                                            Promote to Moderator
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRoleUpdate(user.id, 'admin')}>
                                            Make Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600 focus:text-red-600">
                                            Remove User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
