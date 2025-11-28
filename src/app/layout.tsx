import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Amartha Assist",
  description: "Amartha Assist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth scroll-pt-[100px] ${workSans.variable}`}>
      <body className="min-h-screen overflow-x-hidden custom-scrollbar-hidden antialiased flex justify-center">
        <div className="w-full max-w-[402px] min-h-screen shadow-custom">
          {children}
        </div>
      </body>
    </html>
  );
}
