"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type FAQType = "celengan" | "modal" | "amartha";

const faqDataMap: Record<FAQType, FAQItem[]> = {
  celengan: [
    {
      id: "celengan-1",
      question: "Kriteria pengguna Celengan",
      answer:
        "Seluruh pengguna dan mitra Amartha yang memiliki akun AmarthaFin dapat menggunakan fitur Celengan.",
    },
    {
      id: "celengan-2",
      question: "Proses pendanaan Celengan",
      answer:
        "Proses pendanaan Celengan akan berlangsung secara seketika/real time. Artinya, jika telah memiliki saldo di aplikasi AmarthaFin (minimal Rp10.000), dana akan langsung masuk dan terekam dalam sistem dengan notifikasi \"Berhasil\" yang didapatkan setelah selesai melakukan pendanaan.",
    },
    {
      id: "celengan-3",
      question: "Sumber dana Celengan diambil dari mana?",
      answer:
        "Saldo Poket AmarthaFin tidak akan berpindah dengan sendirinya ke pendanaan Celengan. Bagi pengguna dan mitra yang telah memiliki saldo Poket minimal Rp 10.000 dan kelipatannya dapat melakukan pendanaan secara mandiri melalui fitur \"Celengan\" di aplikasi AmarthaFin.",
    },
  ],
  modal: [
    {
      id: "modal-1",
      question: "Apa itu majelis?",
      answer:
        "Merujuk model pembiayaan Group Lending dan konsep Grameen Bank, calon penerima pinjaman perorangan diwajibkan membentuk satu kelompok kecil beranggotakan lima orang, lalu bergabung ke satu majelis besar berisi 15-20 orang. Seluruhnya sepakat melakukan tanggung renteng atau menanggung risiko bersama-sama bila salah satu anggota kelompoknya mengalami gagal bayar. Kualitas anggota terjaga, karena setiap penerima pinjaman saling mengawasi kredibilitas satu sama lain.",
    },
    {
      id: "modal-2",
      question: "Keuntungan dan tanggung jawab pembuat majelis",
      answer:
        "Merujuk model pembiayaan Group Lending dan konsep Grameen Bank, calon penerima pinjaman perorangan diwajibkan membentuk satu kelompok kecil beranggotakan lima orang, lalu bergabung ke satu majelis besar berisi 15-20 orang. Seluruhnya sepakat melakukan tanggung renteng atau menanggung risiko bersama-sama bila salah satu anggota kelompoknya mengalami gagal bayar. Kualitas anggota terjaga, karena setiap penerima pinjaman saling mengawasi kredibilitas satu sama lain.",
    },
    {
      id: "modal-3",
      question: "Cara gabung ke majelis",
      answer:
        "Merujuk model pembiayaan Group Lending dan konsep Grameen Bank, calon penerima pinjaman perorangan diwajibkan membentuk satu kelompok kecil beranggotakan lima orang, lalu bergabung ke satu majelis besar berisi 15-20 orang. Seluruhnya sepakat melakukan tanggung renteng atau menanggung risiko bersama-sama bila salah satu anggota kelompoknya mengalami gagal bayar. Kualitas anggota terjaga, karena setiap penerima pinjaman saling mengawasi kredibilitas satu sama lain.",
    },
    {
      id: "modal-4",
      question: "Apa syarat & ketentuan pengajuan modal",
      answer:
        "Merujuk model pembiayaan Group Lending dan konsep Grameen Bank, calon penerima pinjaman perorangan diwajibkan membentuk satu kelompok kecil beranggotakan lima orang, lalu bergabung ke satu majelis besar berisi 15-20 orang. Seluruhnya sepakat melakukan tanggung renteng atau menanggung risiko bersama-sama bila salah satu anggota kelompoknya mengalami gagal bayar. Kualitas anggota terjaga, karena setiap penerima pinjaman saling mengawasi kredibilitas satu sama lain.",
    },
  ],
  amartha: [
    {
      id: "amartha-1",
      question: "Apa itu Amartha?",
      answer:
        "Amartha adalah platform teknologi finansial yang menghubungkan UMKM dengan pendana untuk mendapatkan akses permodalan yang mudah dan terjangkau.",
    },
    {
      id: "amartha-2",
      question: "Apakah Amartha aman dan terpercaya?",
      answer:
        "Ya, Amartha terdaftar dan diawasi oleh Otoritas Jasa Keuangan (OJK). Kami berkomitmen untuk menjaga keamanan data dan dana Anda dengan standar keamanan tinggi.",
    },
    {
      id: "amartha-3",
      question: "Bagaimana cara menghubungi customer service Amartha?",
      answer:
        "Anda dapat menghubungi customer service kami melalui fitur chat di aplikasi, email ke cs@amartha.com, atau telepon ke hotline kami yang tersedia 24/7.",
    },
  ],
};

interface FAQProps {
  type: FAQType;
}

export function FAQ({ type }: FAQProps) {
  const faqData = faqDataMap[type];

  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left text-[#853491]">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-zinc-600">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
