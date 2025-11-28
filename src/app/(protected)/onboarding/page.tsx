"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  SuccessRegister,
  QuestionForm,
  RecommendationResult,
} from "@/modules/onboarding";
import type { ProductType } from "@/modules/onboarding";
import { saveRecommendation } from "@/services/recommendation";

export const runtime = "edge";

type Step = "success" | "questions" | "recommendation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("success");
  const [recommendation, setRecommendation] = useState<ProductType | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  const handleStartQuestions = () => {
    setStep("questions");
  };

  const handleBackToSuccess = () => {
    setStep("success");
  };

  const handleQuestionsComplete = (
    userAnswers: Record<number, string>,
    userRecommendation: ProductType
  ) => {
    setAnswers(userAnswers);
    setRecommendation(userRecommendation);
    setStep("recommendation");
  };

  const getProductRoute = (product: ProductType): string => {
    switch (product) {
      case "Modal":
        return "/dashboard/modal";
      case "Celengan":
        return "/dashboard/celengan";
      case "AmarthaLink":
        return "/dashboard/amartha-link";
      default:
        return "/dashboard";
    }
  };

  const handleContinueToDashboard = async () => {
    if (!recommendation) return;

    setSaving(true);
    try {
      const result = await saveRecommendation(recommendation, answers);
      const route = getProductRoute(recommendation);
      if (result.success) {
        router.push(route);
      } else {
        console.error("Failed to save recommendation:", result.message);
        // Still navigate even if save fails
        router.push(route);
      }
    } catch (error) {
      console.error("Error saving recommendation:", error);
      router.push(getProductRoute(recommendation));
    } finally {
      setSaving(false);
    }
  };

  if (step === "success") {
    return <SuccessRegister onStart={handleStartQuestions} />;
  }

  if (step === "questions") {
    return (
      <QuestionForm
        onBack={handleBackToSuccess}
        onComplete={handleQuestionsComplete}
      />
    );
  }

  if (step === "recommendation" && recommendation) {
    return (
      <RecommendationResult
        recommendation={recommendation}
        onContinue={handleContinueToDashboard}
        saving={saving}
      />
    );
  }

  return null;
}
