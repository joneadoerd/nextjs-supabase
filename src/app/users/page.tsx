import { UsersTable } from "@/components/users-table"
import { getUsers } from "@/actions/user-actions"

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">User Management</h1>
      <UsersTable initialUsers={users} />
    </div>
  )
}

