import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-8">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-zinc-900">Welcome</h1>
        <p className="mt-3 text-zinc-500">
          Secure authentication with phone number and PIN
        </p>
      </div>

      <div className="space-y-3 pb-8">
        <Link
          href="/login"
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="flex w-full items-center justify-center rounded-xl border border-zinc-200 py-3.5 font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
