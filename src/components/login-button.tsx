"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from 'next/navigation'

export default function LoginButton(props: { nextUrl?: string }) {
const router =useRouter()
return (
  <button type="button" onClick={() => router.push('/login')}>
    Login
  </button>
);

}
