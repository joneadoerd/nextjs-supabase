import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";

export default async function SubscribersPage() {
  const supabase =await createSupabaseServerComponentClient();


  // Fetch all users with active subscriptions
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, subscriptions!inner(subscriptions_status)")
    .eq("subscriptions.subscriptions_status", "active");
    // console.log(data);

  if (error) {
    return <p className="text-red-500">Error fetching data: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No active subscribers found.</p>;
  }

  return (
    <div className="p-6  shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Active Subscribers</h1>
      <ul className="space-y-2">
        {data.map((user) => (
          <li key={user.id} className="p-2  rounded-md">
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
