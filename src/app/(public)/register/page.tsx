"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendOTP, verifyOTP, createPin } from "@/services/auth";
import { RegisterForm, OtpForm, PinForm } from "@/modules/register";

type Step = "register" | "otp" | "pin";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("register");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === "otp") {
      const firstInput = document.getElementById("otp-0");
      firstInput?.focus();
    }
    if (step === "pin") {
      const firstInput = document.getElementById("pin-0");
      firstInput?.focus();
    }
  }, [step]);

  const handleBack = () => {
    setError("");
    if (step === "register") {
      router.push("/");
    } else if (step === "otp") {
      setStep("register");
      setOtp(["", "", "", "", "", ""]);
    } else if (step === "pin") {
      setStep("otp");
      setPin(["", "", "", "", "", ""]);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Masukkan nama lengkap");
      return;
    }

    if (phoneNumber.length < 9 || phoneNumber.length > 13) {
      setError("Masukkan nomor telepon yang valid");
      return;
    }

    if (!agreedToTerms) {
      setError("Anda harus menyetujui syarat dan ketentuan");
      return;
    }

    setLoading(true);
    const formattedPhone = `+62${phoneNumber}`;
    const result = await sendOTP(formattedPhone);

    if (result.success) {
      setStep("otp");
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  const handleOtpChange = async (index: number, value: string) => {
    if (value.length > 1) return;
    if (value !== "" && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when all 6 digits are filled
    if (value !== "" && index === 5) {
      const otpValue = newOtp.join("");
      if (otpValue.length === 6) {
        setError("");
        setLoading(true);

        const formattedPhone = `+62${phoneNumber}`;
        const result = await verifyOTP(formattedPhone, otpValue);

        if (result.success) {
          setStep("pin");
        } else {
          setError(result.message);
        }

        setLoading(false);
      }
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
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

        const result = await createPin(pinValue);

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

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && pin[index] === "" && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  if (step === "register") {
    return (
      <RegisterForm
        fullName={fullName}
        setFullName={setFullName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        agreedToTerms={agreedToTerms}
        setAgreedToTerms={setAgreedToTerms}
        error={error}
        loading={loading}
        onBack={handleBack}
        onSubmit={handleRegisterSubmit}
      />
    );
  }

  if (step === "otp") {
    return (
      <OtpForm
        otp={otp}
        phoneNumber={phoneNumber}
        error={error}
        loading={loading}
        onBack={handleBack}
        onOtpChange={handleOtpChange}
        onOtpKeyDown={handleOtpKeyDown}
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
