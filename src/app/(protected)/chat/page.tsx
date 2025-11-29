"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useChat } from "@/hooks/useChat";
import { ChatSidebar, ChatMessages, ChatInput } from "@/components/chat";

export const runtime = "edge";

export default function ChatPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    messages,
    threads,
    currentThreadId,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    sendAudioMessage,
    loadThread,
    loadThreads,
    newThread,
    deleteThread,
    clearError,
  } = useChat();

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const handleEndSession = () => {
    newThread();
    router.push("/dashboard");
  };

  return (
    <div
      className="flex flex-col h-dvh"
      style={{ background: 'linear-gradient(to right, #D04D86 11%, #853491 61%)' }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div className="flex-1 flex justify-center">
          <Image
            src="/amartha-assist.png"
            alt="amarthaAssist"
            width={140}
            height={20}
            priority
          />
        </div>

        <button
          onClick={handleEndSession}
          className="p-2 -mr-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Go to Dashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </button>
      </div>

      {/* Content area with white background and rounded top */}
      <div className="flex-1 flex flex-col bg-white rounded-t-[20px] overflow-hidden">
        {/* Error Banner */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Messages */}
        <ChatMessages messages={messages} isLoading={isLoading} />

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onSendAudio={sendAudioMessage}
          disabled={isLoading}
          isStreaming={isStreaming}
        />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        threads={threads}
        currentThreadId={currentThreadId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectThread={loadThread}
        onNewThread={newThread}
        onDeleteThread={deleteThread}
      />
    </div>
  );
}
