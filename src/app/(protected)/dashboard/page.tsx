import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MessageCircle } from "lucide-react";

export const runtime = "edge";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-white relative">
      {/* Purple gradient header */}
      <Image 
        src="/ellipse-dashboard.svg"
        alt="Background Ellipse"
        width={0}
        height={0}
        className="size-auto absolute top-0 w-full"

      />
      {/* Content area */}
      <div className="space-y-4 z-10 items-center mt-12 flex flex-col w-full px-4">
        <Image
          src="/amartha-logo-dashboard.svg"
          alt="Amartha Logo"
          width={0}
          height={0}
          className="h-20 w-auto z-10"
        />
        {/* Poket Card */}
        <div className="bg-white border border-[#BDB7C3] rounded-[20px] shadow-lg overflow-hidden w-full mt-12">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[#853491]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span className="text-sm font-medium text-[#853491]">Poket</span>
            </div>
            <p className="text-sm font-medium text-[#853491]">Rp *******</p>
          </div>
          <div className="border-t border-gray-100 px-4 py-1 flex items-center justify-between">
            <span className="text-xs font-medium text-[#853491]">Upgrade ke premium</span>
            <ChevronRight className="size-6 text-[#853491]" />
          </div>
        </div>

        {/* AmarthaAssist Card */}
        <Link href="/chat" className="w-full px-5 py-2.5 bg-white border border-[#BDB7C3] rounded-[20px]" style={{ boxShadow: '0px 4px 5px 0px rgba(133, 52, 145, 0.5)' }}>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row">
                <MessageCircle className="fill-[#853491] size-6 text-[#853491]" />
                <Image 
                  src="/amartha-assist.svg"
                  alt="Amartha Assist"
                  width={0}
                  height={0}
                  className="size-auto ml-2"
                />
              </div>
              <p className="text-xs text-[#853491]">
                Bingung? Sini, chat AI kita dulu!
              </p>
            </div>
            <ChevronRight className="size-6 text-[#853491]" />
          </div>
        </Link>

        <div className="flex flex-col gap-2 w-full justify-start pb-10">
          <p className="font-bold text-left text-[#853491]">
            Produk yang Tersedia
          </p>

          <Link href="/dashboard/celengan" className="block border border-[#BDB7C3] rounded-[20px] w-full px-3 py-2">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2 items-center mb-1">
                <Image
                  src="/celengan/celengan-ijo.svg"
                  alt="Celengan Icon"
                  width={0}
                  height={0}
                  className="size-5"
                />
                <p className="text-[#58A969] font-bold">
                  Celengan
                </p>
              </div>

              <ChevronRight className="size-6 text-[#853491]"/>
            </div>

            <p className="text-sm font-bold text-[#58A969]">
              Investasi ringan untuk tujuan jangka panjang
            </p>

            <p className="text-[#853491] text-xs">
              Mulai dari Rp10.000, siapkan masa depan keluarga dengan investasi aman
            </p>
          </Link>

          <Link href="/dashboard/modal" className="block border border-[#BDB7C3] rounded-[20px] w-full px-3 py-2">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2 items-center mb-1">
                <Image
                  src="/modal/money-bag-icon.svg"
                  alt="Modal Icon"
                  width={0}
                  height={0}
                  className="size-5"
                />
                <p className="text-[#126295] font-bold">
                  Modal
                </p>
              </div>

              <ChevronRight className="size-6 text-[#853491]"/>
            </div>

            <p className="text-sm font-bold text-[#126295]">
              Pinjaman cepat untuk kebutuhan usaha
            </p>

            <p className="text-[#853491] text-xs">
              Ajukan sekarang, cair dalam 1 hari kerja setelah disetujui.
            </p>
          </Link>

          <Link href="/dashboard/amartha-link" className="block border border-[#BDB7C3] rounded-[20px] w-full px-3 py-2">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row gap-2 items-center mb-1">
                <Image
                  src="/amartha-link/user-home.svg"
                  alt="Amartha Link Icon"
                  width={0}
                  height={0}
                  className="size-5"
                />
                <span className="text-[#853491] font-bold">
                  amartha <span className="text-[#FF921F]">Link</span>
                </span>
              </div>

              <ChevronRight className="size-6 text-[#853491]"/>
            </div>

            <p className="text-sm font-bold text-[#FF921F]">
              Agen instan, komisi besar
            </p>

            <p className="text-[#853491] text-xs">
              Mulai dari Rp10.000, siapkan masa depan keluarga dengan investasi aman
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
