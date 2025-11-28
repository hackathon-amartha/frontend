"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
    >
      Logout
    </button>
  );
}
