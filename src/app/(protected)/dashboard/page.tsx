import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <div className="flex-1 px-4 py-6">
        {/* Chat CTA */}
        <Link
          href="/chat"
          className="block mb-4 rounded-2xl bg-blue-600 p-5 shadow-sm hover:bg-blue-700 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">Start Chat</h3>
              <p className="text-white/80 text-sm">
                Ask questions about loans and more
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

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
