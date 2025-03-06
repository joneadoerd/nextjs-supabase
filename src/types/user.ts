import { z } from "zod"

export const UserSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["Admin", "User", "Editor", "Viewer"]),
  created_at: z.string().datetime().optional(),
})

export type User = z.infer<typeof UserSchema>

