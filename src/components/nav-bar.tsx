"use server";
import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import LoginButton from "./login-button";
import LogoutButton from "./logout-button";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getCurrentUserRole } from "@/app/login/actions";
export default async function NavBar() {
  const { data, error } = await (
    await createSupabaseServerComponentClient()
  ).auth.getUser();
  const role = await getCurrentUserRole(data?.user?.id!);
  return (
    <>
      {data?.user && (
        <>
          <p>Hello {data?.user?.email} </p>
          <p>Role: {role}</p>
          <LogoutButton />
        </>
      ) || <LoginButton />}
    </>
  );
}
