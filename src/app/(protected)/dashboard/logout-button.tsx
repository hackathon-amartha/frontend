"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/services/auth";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Button
      onClick={handleLogout}
      className="w-full rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium"
    >
      Logout
    </Button>
  );
}
