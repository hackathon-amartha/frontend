"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PhoneInput } from "@/components/ui/phone-input";
import { Button } from "@/components/ui/button";
import { loginWithPhoneAndPin } from "@/services/auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Step = "phone" | "pin";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === "pin") {
      const firstInput = document.getElementById("pin-0");
      firstInput?.focus();
    }
  }, [step]);

  const validatePhoneNumber = (phone: string): boolean => {
    return phone.length >= 9 && phone.length <= 13;
  };

  const handleBack = () => {
    setError("");
    setStep("phone");
    setPin(["", "", "", "", "", ""]);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Masukkan nomor telepon yang valid");
      return;
    }

    setStep("pin");
  };

  const handlePinChange = async (index: number, value: string) => {
    if (value.length > 1) return;
    if (value !== "" && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (value !== "" && index === 5) {
      const pinValue = newPin.join("");
      if (pinValue.length === 6) {
        setError("");
        setLoading(true);

        const formattedPhone = `+62${phoneNumber}`;
        const result = await loginWithPhoneAndPin(formattedPhone, pinValue);

        if (result.success) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setError(result.message);
        }

        setLoading(false);
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  if (step === "phone") {
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
          <h1 className="text-[#853491] font-bold text-2xl mb-16">
            Selamat Datang <br /> di AmarthaFin
          </h1>

          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="rounded-[20px] bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-[#853491] text-lg">
                Nomor Telepon
              </label>
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

            <Link href="/register" className="text-center text-[#853491] font-medium">
              Belum punya akun?
            </Link>
          </form>
        </div>
      </div>
    );
  }

  // PIN Step
  return (
    <div className="flex min-h-screen flex-col bg-white py-8 relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 border-b border-[#BDB7C3] pt-2 pb-6 px-8">
        <button
          type="button"
          onClick={handleBack}
          className="text-[#853491] cursor-pointer"
        >
          <ArrowLeft className="size-6"/>
        </button>
        <span className="text-[#853491] text-2xl">PIN</span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-8">
        <div className="flex flex-col items-center w-full max-w-sm gap-12">
          {error && (
            <div className="rounded-[20px] bg-red-50 p-3 text-sm text-red-600 mb-4 w-full text-center">
              {error}
            </div>
          )}

          <p className="text-[#853491] font-medium">{loading ? "Loading..." : "Masukan PIN"}</p>

          <div className="flex gap-3.5">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(index, e)}
                disabled={loading}
                className="w-10 h-10 rounded-full bg-[#E5E5EA] text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#853491] disabled:opacity-50"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
