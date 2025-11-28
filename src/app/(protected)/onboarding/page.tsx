"use client";

import { useState } from "react";
import { SuccessRegister, QuestionForm } from "@/modules/onboarding";

export const runtime = "edge";

type Step = "success" | "questions";

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("success");

  const handleStartQuestions = () => {
    setStep("questions");
  };

  const handleBackToSuccess = () => {
    setStep("success");
  };

  if (step === "success") {
    return <SuccessRegister onStart={handleStartQuestions} />;
  }

  return <QuestionForm onBack={handleBackToSuccess} />;
}
