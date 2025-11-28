"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

const allQuestions: Question[] = [
  {
    id: 1,
    question: "Apa yang sedang anda butuhkan sekarang?",
    options: [
      "Menambah modal usaha",
      "Mencari penghasilan tambahan",
      "Menabung",
      "Belum tahu",
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
}

export function QuestionForm({ onBack }: QuestionFormProps) {
  const router = useRouter();
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
      router.push("/dashboard");
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
              className={`w-full h-[42px] rounded-[20px] text-center font-medium transition-all ${
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
