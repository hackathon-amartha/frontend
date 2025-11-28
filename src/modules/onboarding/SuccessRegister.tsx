import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SuccessRegisterProps {
  onStart: () => void;
}

export function SuccessRegister({ onStart }: SuccessRegisterProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      {/* Background Ellipse */}
      <Image
        src="/onboarding/ellipse.svg"
        alt="Background"
        width={0}
        height={0}
        className="size-auto top-0 absolute w-full"
      />

      {/* Header Text on Ellipse */}
      <div className="relative z-10 pt-20 px-8 text-center text-white">
        <h1 className="font-bold text-2xl">
          Selamat!
          <br />
          Anda sudah memiliki akun
          <br />
          AmarthaFin
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-8 mt-20">
        <div className="flex flex-col items-center w-full max-w-sm gap-8 text-center">
          <h2 className="text-[#853491] text-2xl">
            Yuk cari tau produk Amartha
            <br />
            yang cocok dengan Anda!
          </h2>

          <p className="text-[#853491] font-medium">
            Cukup jawab <span className="font-bold">5 pertanyaan</span> agar
            <br />
            rekomendasinya lebih tepat.
          </p>

          <Button
            onClick={onStart}
            className="rounded-[20px] bg-[#853491] hover:bg-[#853491]/90 h-[42px] text-white font-medium w-full max-w-xs mt-4"
          >
            Mulai
          </Button>
        </div>
      </div>
    </div>
  );
}
