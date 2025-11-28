"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Question {
  id: number;
  question: string;
  options: string[];
  conditionalOn?: {
    questionId: number;
    answer: string;
  };
}

// Scoring system for product recommendation
// Modal: Business capital loans for micro-entrepreneurs
// Celengan: Savings/investment for those with extra money
// AmarthaLink: Digital transaction services for agents/retailers

export type ProductType = "Modal" | "Celengan" | "AmarthaLink";

interface ProductScores {
  Modal: number;
  Celengan: number;
  AmarthaLink: number;
}

// Scoring weights for each answer
const scoringRules: Record<number, Record<string, Partial<ProductScores>>> = {
  // Question 1: What do you need now?
  1: {
    "Menambah modal usaha": { Modal: 3 },
    "Mencari penghasilan tambahan": { AmarthaLink: 3 },
    "Menabung": { Celengan: 3 },
  },
  // Question 2: What business do you have?
  2: {
    "Warung kelontong atau kios": { Modal: 2, AmarthaLink: 2 },
    "Bertani atau beternak": { Modal: 2 },
    "Kuliner (makanan atau minuman)": { Modal: 2, AmarthaLink: 1 },
    "Jasa atau layanan": { Modal: 1, AmarthaLink: 1 },
    "Produksi atau kerajinan": { Modal: 2 },
    "Tidak ada": { Celengan: 2, AmarthaLink: 1 },
  },
  // Question 3: Is your shop busy?
  3: {
    "Ramai": { Modal: 2, AmarthaLink: 2 },
    "Sepi": { Modal: 1 },
    "Tidak menentu": { Modal: 1, AmarthaLink: 1 },
  },
  // Question 4: Phone proficiency
  4: {
    "Masih sering bingung": { Modal: 1 },
    "Lumayan bisa": { Modal: 1, AmarthaLink: 1 },
    "Sudah cukup lancar": { AmarthaLink: 2, Celengan: 1 },
    "Lancar sekali": { AmarthaLink: 3, Celengan: 2 },
  },
  // Question 5: Money situation
  5: {
    "Selalu habis": { Modal: 2 },
    "Ada sisa sedikit": { Modal: 1, AmarthaLink: 1 },
    "Ada sisa cukup banyak": { Celengan: 3, AmarthaLink: 1 },
  },
};

// Calculate recommended product based on answers
export function calculateRecommendation(answers: Record<number, string>): ProductType {
  const scores: ProductScores = { Modal: 0, Celengan: 0, AmarthaLink: 0 };

  Object.entries(answers).forEach(([questionId, answer]) => {
    const questionScores = scoringRules[parseInt(questionId)];
    if (questionScores && questionScores[answer]) {
      const answerScores = questionScores[answer];
      if (answerScores.Modal) scores.Modal += answerScores.Modal;
      if (answerScores.Celengan) scores.Celengan += answerScores.Celengan;
      if (answerScores.AmarthaLink) scores.AmarthaLink += answerScores.AmarthaLink;
    }
  });

  // Find the product with highest score
  const maxScore = Math.max(scores.Modal, scores.Celengan, scores.AmarthaLink);

  if (scores.Modal === maxScore) return "Modal";
  if (scores.Celengan === maxScore) return "Celengan";
  return "AmarthaLink";
}

const allQuestions: Question[] = [
  {
    id: 1,
    question: "Apa yang sedang anda butuhkan sekarang?",
    options: [
      "Menambah modal usaha",
      "Mencari penghasilan tambahan",
      "Menabung",
    ],
  },
  {
    id: 2,
    question: "Usaha apa yang anda miliki?",
    options: [
      "Warung kelontong atau kios",
      "Bertani atau beternak",
      "Kuliner (makanan atau minuman)",
      "Jasa atau layanan",
      "Produksi atau kerajinan",
      "Tidak ada",
    ],
  },
  {
    id: 3,
    question: "Sehari-hari, warung Ibu itu lebih sering ramai atau sepi?",
    options: ["Ramai", "Sepi", "Tidak menentu"],
    conditionalOn: {
      questionId: 2,
      answer: "Warung kelontong atau kios",
    },
  },
  {
    id: 4,
    question: "Ketika memakai HP, anda...",
    options: [
      "Masih sering bingung",
      "Lumayan bisa",
      "Sudah cukup lancar",
      "Lancar sekali",
    ],
  },
  {
    id: 5,
    question: "Uang anda biasanya...",
    options: ["Selalu habis", "Ada sisa sedikit", "Ada sisa cukup banyak"],
  },
];

interface QuestionFormProps {
  onBack: () => void;
  onComplete: (answers: Record<number, string>, recommendation: ProductType) => void;
}

export function QuestionForm({ onBack, onComplete }: QuestionFormProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [progressStep, setProgressStep] = useState(1);

  const getVisibleQuestions = (): Question[] => {
    return allQuestions.filter((q) => {
      if (!q.conditionalOn) return true;
      const { questionId, answer } = q.conditionalOn;
      return answers[questionId] === answer;
    });
  };

  const visibleQuestions = getVisibleQuestions();
  const currentQ = visibleQuestions[currentQuestionIndex];

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setProgressStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSelectOption = (option: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: option,
    }));
  };

  const handleNext = () => {
    const newVisibleQuestions = getVisibleQuestions();
    const shouldSkipConditional =
      currentQ.id === 2 && answers[2] !== "Warung kelontong atau kios";

    if (currentQuestionIndex < newVisibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Skip progress step 3 if not warung kelontong
      setProgressStep((prev) => (shouldSkipConditional ? prev + 2 : prev + 1));
    } else {
      // Calculate recommendation and call onComplete
      const recommendation = calculateRecommendation(answers);
      onComplete(answers, recommendation);
    }
  };

  const progress = (progressStep / 5) * 100;
  const isAnswered = answers[currentQ.id] !== undefined && answers[currentQ.id] !== "";

  return (
    <div className="flex min-h-screen flex-col bg-white py-8">
      {/* Header with back button and progress */}
      <div className="flex items-center gap-4 px-8 mb-8">
        <button
          type="button"
          onClick={handleBack}
          className="text-[#853491] cursor-pointer"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="flex-1 h-2 bg-[#E5E5EA] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#853491] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="px-8 mb-8">
        <h1 className="text-[#853491] font-bold text-2xl text-center">
          {currentQ.question}
        </h1>
      </div>

      {/* Options */}
      <div className="flex-1 px-8">
        <div className="flex flex-col gap-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectOption(option)}
              className={`w-full h-[42px] rounded-[20px] text-center font-medium transition-all cursor-pointer ${
                answers[currentQ.id] === option
                  ? "bg-[#E4D7F1] text-[#853491]"
                  : "bg-[#E5E5EA] text-gray-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="px-8 mt-auto">
        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium w-full disabled:bg-[#AEAEB2] disabled:opacity-100"
        >
          Lanjut
        </Button>
      </div>
    </div>
  );
}
