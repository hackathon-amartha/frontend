"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithPhoneAndPin } from "@/services/auth";
import { getRecommendation } from "@/services/recommendation";
import { PhoneForm, PinForm } from "@/modules/login";

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
          // Check if user has recommendation
          const { recommendation } = await getRecommendation();

          if (recommendation) {
            router.push("/dashboard");
          } else {
            router.push("/onboarding");
          }
          router.refresh();
        } else {
          setError(result.message);
        }

        setLoading(false);
      }
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  if (step === "phone") {
    return (
      <PhoneForm
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        error={error}
        onSubmit={handlePhoneSubmit}
      />
    );
  }

  return (
    <PinForm
      pin={pin}
      error={error}
      loading={loading}
      onBack={handleBack}
      onPinChange={handlePinChange}
      onPinKeyDown={handlePinKeyDown}
    />
  );
}
