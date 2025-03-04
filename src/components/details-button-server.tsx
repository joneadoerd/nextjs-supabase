import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import DetailsButtonClient from "./details-button-client";

export default async function DetailsButtonServer() {
  const supabase =await createSupabaseServerComponentClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  // Fetch customer details based on user_id
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user!.id)
    .single(); // Use .single() since we expect only one customer per user

  const {data: subscriptions, error: subscriptionsError} = await supabase.from('subscriptions').select('*').eq('user_id', user!.id).single();
  return <DetailsButtonClient user={user} customer={customer} subscriptions={subscriptions} />;
}
