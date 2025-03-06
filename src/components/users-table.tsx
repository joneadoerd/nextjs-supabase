"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { EditUserDialog } from "@/components/edit-user-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { deleteUser, createUser, updateUser } from "@/actions/user-actions"
import type { User } from "@/types/user"
import { toast } from "sonner"

interface UsersTableProps {
  initialUsers: User[]
}

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsCreating(false)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedUser(null)
    setIsCreating(true)
    setIsDialogOpen(true)
  }

  const handleDeleteConfirm = (userId: string) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete)
      setUsers(users.filter((user) => user.id !== userToDelete))
      toast("User deleted successfully", { duration: 3000, description: "The user has been successfully deleted." })
    } catch (error) {
      toast("Failed to delete user", { duration: 3000, description: "An error occurred while deleting the user." })
    } finally {
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      if (isCreating) {
        const newUser = await createUser(updatedUser)
        setUsers([newUser, ...users])
        toast("User created successfully", { duration: 3000, description: "The user has been successfully created." })
      } else {
        const updated = await updateUser(updatedUser)
        setUsers(users.map((user) => (user.id === updated.id ? updated : user)))
        toast("User updated successfully", { duration: 3000, description: "The user has been successfully updated." })
      }
      setIsDialogOpen(false)
    } catch (error) {
      if (error instanceof Error) {
        toast("Operation failed", { duration: 3000, description: error.message })
      } else {
        toast("Operation failed", { duration: 3000, description: "An unexpected error occurred." })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Users List</h2>
        <Button onClick={handleCreate} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%] sm:w-auto">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.name}
                    <div className="block sm:hidden text-xs text-muted-foreground mt-1">{user.email}</div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.role}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(user)}
                        aria-label={`Edit ${user.name}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteConfirm(user.id)}
                        aria-label={`Delete ${user.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        user={selectedUser}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdate={handleUpdateUser}
        isCreating={isCreating}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        userName={users.find((user) => user.id === userToDelete)?.name || ""}
      />
    </div>
  )
}

