"use client";

import { ArrowLeft } from "lucide-react";

interface OtpFormProps {
  otp: string[];
  phoneNumber: string;
  error: string;
  loading: boolean;
  onBack: () => void;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function OtpForm({
  otp,
  phoneNumber,
  error,
  loading,
  onBack,
  onOtpChange,
  onOtpKeyDown,
}: OtpFormProps) {
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
        <span className="text-[#853491] text-2xl">OTP</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-8">
        <div className="flex flex-col items-center w-full max-w-sm gap-12">
          {error && (
            <div className="rounded-[20px] bg-red-50 p-3 text-sm text-red-600 mb-4 w-full text-center">
              {error}
            </div>
          )}

          <p className="text-[#853491] font-medium">
            {loading ? "Loading..." : "Masukan OTP"}
          </p>

          <div className="flex gap-3.5">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => onOtpChange(index, e.target.value)}
                onKeyDown={(e) => onOtpKeyDown(index, e)}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-[#E5E5EA] text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#853491] disabled:opacity-50"
              />
            ))}
          </div>

          <p className="text-gray-500 text-sm">OTP dikirim ke +62{phoneNumber}</p>
        </div>
      </div>
    </div>
  );
}
