'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createSupabaseServerClient } from '@/lib/supabase/server-client'
export async function getCurrentUserRole(userId: string) {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
      .eq('user_id', userId)
    .single();

  return error ? null : data?.role;
}
export async function login(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const input = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data,error } = await supabase.auth.signInWithPassword(input)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}