"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User } from "@/types/user"
import { UserSchema } from "@/types/user"
import { toast } from "sonner"
interface EditUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (user: User) => void
  isCreating?: boolean
}

export function EditUserDialog({ user, open, onOpenChange, onUpdate, isCreating = false }: EditUserDialogProps) {
  const [formData, setFormData] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "User",
  })
  const [errors, setErrors] = useState<Partial<User>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
 

  useEffect(() => {
    if (isCreating) {
      setFormData({
        id: crypto.randomUUID(),
        name: "",
        email: "",
        role: "User",
      })
    } else if (user) {
      setFormData(user)
    }
    setErrors({})
  }, [user, isCreating, open])

  const handleChange = (field: keyof User, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Clear the error for this field when it's changed
    setErrors({ ...errors, [field]: undefined })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const validatedData = UserSchema.parse(formData)
      await onUpdate(validatedData)
    } catch (error) {
      if (error instanceof Error) {
        toast("Operation failed", { duration: 3000, description: error.message })
      }
      if (error.errors) {
        const validationErrors = error.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message
          return acc
        }, {})
        setErrors(validationErrors)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isCreating ? "Create User" : "Edit User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="col-span-3"
                required
              />
              {errors.name && <p className="text-red-500 text-sm col-start-2 col-span-3">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="col-span-3"
                required
              />
              {errors.email && <p className="text-red-500 text-sm col-start-2 col-span-3">{errors.email}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select value={formData.role} onValueChange={(value) => handleChange("role", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-red-500 text-sm col-start-2 col-span-3">{errors.role}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : isCreating ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

