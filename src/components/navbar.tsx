"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  // Hide navbar on login/register pages
  if (pathname === "/" || pathname === "/register") {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          Amartha
        </Link>
        <nav className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
