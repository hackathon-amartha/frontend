"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginWithPhoneAndPin } from "@/services/auth";

type Step = "phone" | "pin";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("+62");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Ensure +62 prefix is always present and only allow digits after it
    if (!value.startsWith("+62")) {
      return;
    }
    const afterPrefix = value.slice(3);
    if (afterPrefix === "" || /^\d*$/.test(afterPrefix)) {
      setPhoneNumber(value);
    }
  };
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+[1-9]\d{9,14}$/;
    return phoneRegex.test(phone);
  };

  const handleBack = () => {
    setError("");
    if (step === "phone") {
      router.push("/");
    } else {
      setStep("phone");
      setPin("");
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number (e.g., +62812345678)");
      return;
    }

    setStep("pin");
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await loginWithPhoneAndPin(phoneNumber, pin);

    if (result.success) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 py-8">
      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-4 flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">Login</h1>
        <p className="mt-2 text-sm text-zinc-500">
          {step === "phone" && "Enter your phone number to continue"}
          {step === "pin" && "Enter your PIN to login"}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 flex gap-2">
        {["phone", "pin"].map((s, i) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full ${
              i <= ["phone", "pin"].indexOf(step)
                ? "bg-blue-600"
                : "bg-zinc-200"
            }`}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Step 1: Phone Number */}
      {step === "phone" && (
        <form onSubmit={handlePhoneSubmit} className="flex flex-1 flex-col">
          <div className="flex-1">
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-zinc-700"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="+628123456789"
              required
              className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      )}

      {/* Step 2: PIN */}
      {step === "pin" && (
        <form onSubmit={handlePinSubmit} className="flex flex-1 flex-col">
          <div className="flex-1">
            <div className="mb-4 rounded-xl bg-zinc-50 p-3">
              <p className="text-sm text-zinc-500">
                Logging in as:{" "}
                <span className="font-medium text-zinc-900">{phoneNumber}</span>
              </p>
            </div>
            <label
              htmlFor="pin"
              className="block text-sm font-medium text-zinc-700"
            >
              PIN
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 6 digit PIN"
              required
              maxLength={6}
              minLength={6}
              autoFocus
              className="mt-2 block w-full rounded-xl border border-zinc-200 px-4 py-3 text-center text-2xl tracking-widest text-zinc-900 placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-blue-600 py-3.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}
