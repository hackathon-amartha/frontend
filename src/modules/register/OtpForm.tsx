"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface OtpFormProps {
  otp: string[];
  phoneNumber: string;
  error: string;
  loading: boolean;
  onBack: () => void;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onResendOtp: () => void;
}

export function OtpForm({
  otp,
  phoneNumber,
  error,
  loading,
  onBack,
  onOtpChange,
  onOtpKeyDown,
  onResendOtp,
}: OtpFormProps) {
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResendOtp = () => {
    if (timer === 0) {
      onResendOtp();
      setTimer(30);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

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
        <span className="text-[#853491] text-2xl">Verifikasi Kode OTP</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-8">
        <div className="flex flex-col items-center w-full max-w-sm gap-8">
          {error && (
            <div className="rounded-[20px] bg-red-50 p-3 text-sm text-red-600 mb-4 w-full text-center">
              {error}
            </div>
          )}

          <p className="text-[#853491] font-medium text-center">
            Masukkan kode OTP yang telah dikirimkan <br /> melalui Whatsapp
          </p>

          <div className="flex gap-2">
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
                className="w-12 h-20 rounded-[20px] bg-[#E5E5EA] text-center text-2xl focus:outline-none focus:ring-2 focus:ring-[#853491] disabled:opacity-50"
              />
            ))}
          </div>

          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timer > 0}
              className={`text-sm font-medium ${
                timer > 0
                  ? "text-[#AEAEB2] cursor-default"
                  : "text-[#853491] cursor-pointer"
              }`}
            >
              Kirim Ulang Kode OTP
            </button>
            <span className="text-[#AEAEB2] text-sm">{formatTime(timer)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
