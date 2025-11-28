import { FloatingChatButton } from "@/components/FloatingChatButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FloatingChatButton />
    </>
  );
}
