"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
    currentThreadTitle,
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
    <div className="flex flex-col h-dvh bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-white">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-2 text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors"
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

        <div className="flex-1 text-center">
          <h1 className="text-sm font-semibold text-zinc-800 truncate px-2">
            {currentThreadTitle || "New Chat"}
          </h1>
        </div>

        <button
          onClick={handleEndSession}
          className="p-2 -mr-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          title="End Session"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

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
