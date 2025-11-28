"use client";

import { ArrowLeft } from "lucide-react";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface RegisterFormProps {
  fullName: string;
  setFullName: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (value: boolean) => void;
  error: string;
  loading: boolean;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  fullName,
  setFullName,
  phoneNumber,
  setPhoneNumber,
  agreedToTerms,
  setAgreedToTerms,
  error,
  loading,
  onBack,
  onSubmit,
}: RegisterFormProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white py-8 relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-[#BDB7C3] pt-2 pb-6 px-8">
        <button
          type="button"
          onClick={onBack}
          className="text-[#853491] cursor-pointer"
        >
          <ArrowLeft className="size-6" />
        </button>
        <span className="text-[#853491] text-2xl">Registrasi</span>
      </div>

      <div className="flex flex-col flex-1 px-8">
        <h1 className="text-[#853491] font-bold text-2xl mb-10">
          Yuk isi data registrasi <br /> terlebih dahulu !
        </h1>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {error && (
            <div className="rounded-[20px] bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="text-[#853491] font-medium">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Amartha Assist"
              className="w-full h-[42px] rounded-[20px] bg-[#E5E5EA] px-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#853491]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#853491] font-medium">Nomor Telepon</label>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              placeholder="81234654851"
            />
          </div>

          <div className="flex items-center justify-center gap-2 mt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              className="bg-[#E5E5EA] border-none data-[state=checked]:bg-[#853491]"
            />
            <label htmlFor="terms" className="text-gray-500 text-sm">
              Saya menyetujui{" "}
              <a
                href="https://amartha.com/syarat-dan-ketentuan/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#853491] underline"
              >
                Syarat & Ketentuan
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium mt-4"
          >
            {loading ? "Loading..." : "Daftar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
