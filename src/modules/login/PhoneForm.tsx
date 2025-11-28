"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";

interface PhoneFormProps {
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}

export function PhoneForm({
  phoneNumber,
  setPhoneNumber,
  error,
  onSubmit,
}: PhoneFormProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-8 py-8 relative">
      <Image
        src="/auth/top-circle.svg"
        alt="Top Circle Svg"
        width={0}
        height={0}
        className="absolute size-auto top-0 right-0"
      />
      <Image
        src="/amartha-logo.svg"
        alt="Amartha Logo"
        width={0}
        height={0}
        className="absolute size-auto top-20 right-0"
      />
      <div className="flex flex-col w-full max-w-sm">
        <h1 className="text-[#853491] font-bold text-2xl mb-16 z-20">
          Selamat Datang <br /> di AmarthaFin
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-[20px] bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[#853491] text-lg">Nomor Telepon</label>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="81234654851"
            />
          </div>

          <Button
            type="submit"
            className="rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium"
          >
            Masuk
          </Button>

          <Link
            href="/register"
            className="text-center text-[#853491] font-medium"
          >
            Belum punya akun?
          </Link>
        </form>
      </div>
    </div>
  );
}
