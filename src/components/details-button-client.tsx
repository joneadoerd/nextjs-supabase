"use client";

import { useState } from "react";
import { type User } from "@supabase/supabase-js";
import Link from "next/link";
import { Database } from "@/lib/supabase/database.types";

export default function DetailsButtonClient({ user ,customer ,subscriptions }: { user: User | null ,customer: Database["public"]["Tables"]["customers"]["Row"]| null ,subscriptions: Database["public"]["Tables"]["subscriptions"]["Row"]| null}) {
  const [isHidden, setIsHidden] = useState(true);

  return (
    <>
      {user ? (
        <>
          <button onClick={() => setIsHidden((prev) => !prev)}>
            {isHidden ? "Show Details" : "Hide Details"}{" "}
          </button>

          <br />

          {isHidden ? null : (
            <>
              <p>{`username: ${customer?.name}`}</p>
              <p> {`subscriptions status: ${subscriptions?.subscriptions_status}`}</p>
              <p>{`email: ${user?.email}`}</p>

              <br />

              <Link href={"/account"}>
                <button>View Account Page</button>
              </Link>
            </>
          )}
        </>
      ) : (
        <p>user is not logged in</p>
      )}
    </>
  );
}
