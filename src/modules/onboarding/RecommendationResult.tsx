"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

type ProductType = "Modal" | "Celengan" | "AmarthaLink";

interface ProductInfo {
  title: string;
  description: string;
  icon: string;
  color: string;
  benefits: string[];
}

const productInfo: Record<ProductType, ProductInfo> = {
  Modal: {
    title: "Modal Usaha",
    description: "Pinjaman modal untuk mengembangkan usaha Anda",
    icon: "/onboarding/modal-icon.svg",
    color: "#853491",
    benefits: [
      "Pencairan dalam 1 hari",
      "Pembayaran aman sesuai kemampuan",
      "Pembayaran otomatis lewat poket",
      "Pendampingan usaha",
    ],
  },
  Celengan: {
    title: "Celengan",
    description: "Kembangkan aset finansial dengan keuntungan prediktif",
    icon: "/onboarding/celengan-icon.svg",
    color: "#2E7D32",
    benefits: [
      "Imbal hasil menarik",
      "Investasi berdampak sosial",
      "Mudah dipantau",
      "Aman dan terpercaya",
    ],
  },
  AmarthaLink: {
    title: "AmarthaLink",
    description: "Dapatkan penghasilan tambahan sebagai agen digital",
    icon: "/onboarding/amarthalink-icon.svg",
    color: "#1565C0",
    benefits: [
      "Layanan pembayaran digital",
      "Top-up e-wallet",
      "Komisi menarik",
      "Jangkau lebih banyak pelanggan",
    ],
  },
};

interface RecommendationResultProps {
  recommendation: ProductType;
  onContinue: () => void;
  saving: boolean;
}

export function RecommendationResult({
  recommendation,
  onContinue,
  saving,
}: RecommendationResultProps) {
  const product = productInfo[recommendation];

  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      <Image
        src="/onboarding/top-left.svg"
        alt="Background"
        width={0}
        height={0}
        className="size-auto absolute"
      />

      {/* Product Card */}
      <div className="flex flex-col items-center justify-between flex-1 px-8 py-16 z-10">
        {/* Header Text */}
        <div className="relative z-10 px-8 text-center text-white">
          <h1 className="font-bold text-2xl text-[#853491]">
            Produk yang Cocok <br /> untuk Anda
          </h1>
        </div>

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6">
          {/* Product Icon */}
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: `${product.color}20` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: product.color }}
            >
              <span className="text-white text-2xl font-bold">
                {recommendation.charAt(0)}
              </span>
            </div>
          </div>

          {/* Product Title */}
          <h2
            className="text-2xl font-bold text-center mb-2"
            style={{ color: product.color }}
          >
            {product.title}
          </h2>

          {/* Product Description */}
          <p className="text-gray-600 text-center mb-6">
            {product.description}
          </p>

          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-800">Keuntungan:</p>
            {product.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${product.color}20` }}
                >
                  <svg
                    className="w-3 h-3"
                    style={{ color: product.color }}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="w-full max-w-sm">
          <Button
            onClick={onContinue}
            disabled={saving}
            className="rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium w-full disabled:bg-[#AEAEB2] disabled:opacity-100"
          >
            Lihat Produk
          </Button>
        </div>
      </div>

      <Image
        src="/onboarding/bottom-right.svg"
        alt="Background"
        width={0}
        height={0}
        className="size-auto absolute bottom-0 right-0"
      />
    </div>
  );
}
