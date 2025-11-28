import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="flex-1 px-4 py-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Welcome!</h2>
          <p className="mt-2 text-sm text-zinc-500">
            You are logged in as: {user.phone}
          </p>
          <div className="mt-4 rounded-xl bg-zinc-50 p-4">
            <p className="text-xs text-zinc-400">User ID</p>
            <p className="mt-1 text-sm font-medium text-zinc-700 break-all">
              {user.id}
            </p>
            <p className="mt-3 text-xs text-zinc-400">Created</p>
            <p className="mt-1 text-sm font-medium text-zinc-700">
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
