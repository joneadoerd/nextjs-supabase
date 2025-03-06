"use server"

import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client"
import { UserSchema, type User } from "@/types/user"
import { revalidatePath } from "next/cache"

export async function getUsers(): Promise<User[]> {
  const supabase = await createSupabaseServerComponentClient()
  const { data, error } = await supabase
    .from("customers")
    .select("user_id, name, auth_users:auth.users(email)")
    .order("name", { ascending: true });
  if (error) {
    console.error("Error fetching users:", error)
    throw new Error("Failed to fetch users")
  }

  return data as User[]
}

export async function createUser(userData: Omit<User, "id" | "created_at">): Promise<User> {
  const validatedData = UserSchema.omit({ id: true, created_at: true }).parse(userData)
  const supabase = await createSupabaseServerComponentClient()
  const { data: { user: data }, error } = await supabase.auth.admin.createUser(validatedData)

  if (error) {
    console.error("Error creating user:", error)
    throw new Error("Failed to create user")
  }

  revalidatePath("/users")
  return data as unknown as User
}

export async function updateUser(userData: User): Promise<User> {
  const validatedData = UserSchema.parse(userData)
  const supabase = await createSupabaseServerComponentClient()
  const { data: { user: data }, error } = await supabase
    .auth.admin.updateUserById(validatedData.id, validatedData)

  if (error) {
    console.error("Error updating user:", error)
    throw new Error("Failed to update user")
  }

  revalidatePath("/users")
  return data as unknown as User
}

export async function deleteUser(userId: string): Promise<void> {
  const supabase = await createSupabaseServerComponentClient()
  const { error } = await supabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error("Error deleting user:", error)
    throw new Error("Failed to delete user")
  }

  revalidatePath("/users")
}

