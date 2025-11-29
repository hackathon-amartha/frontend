"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

const PRODUCT_LINKS: Record<string, string> = {
  "Celengan": "/dashboard/celengan",
  "AmarthaLink": "/dashboard/amartha-link",
  "Amartha Link": "/dashboard/amartha-link",
  "Modal": "/dashboard/modal",
};

function transformProductLinks(content: string): string {
  let result = content;
  for (const [keyword, href] of Object.entries(PRODUCT_LINKS)) {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    result = result.replace(regex, `[${keyword}](${href})`);
  }
  return result;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Loading skeleton when opening a thread
  if (messages.length === 0 && isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User message skeleton */}
        <div className="flex justify-end">
          <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-[#7954A3]/30">
            <Skeleton className="h-4 w-32 bg-white/40" />
          </div>
        </div>

        {/* Assistant message skeleton */}
        <div className="flex justify-start">
          <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-[#E4D7F1]">
            <div className="space-y-2">
              <Skeleton className="h-4 w-48 bg-[#7954A3]/20" />
              <Skeleton className="h-4 w-40 bg-[#7954A3]/20" />
            </div>
          </div>
        </div>

        {/* User message skeleton */}
        <div className="flex justify-end">
          <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-br-md bg-[#7954A3]/30">
            <Skeleton className="h-4 w-24 bg-white/40" />
          </div>
        </div>

        {/* Assistant message skeleton */}
        <div className="flex justify-start">
          <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-md bg-[#E4D7F1]">
            <div className="space-y-2">
              <Skeleton className="h-4 w-56 bg-[#7954A3]/20" />
              <Skeleton className="h-4 w-44 bg-[#7954A3]/20" />
              <Skeleton className="h-4 w-36 bg-[#7954A3]/20" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state when no messages
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 mb-4 bg-[#E4D7F1] rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-[#7954A3]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-800 mb-2">
          Mulai Percakapan
        </h3>
        <p className="text-sm text-zinc-500 max-w-[250px]">
          Tanyakan apa saja tentang pinjaman, aplikasi, atau pertanyaan lainnya.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar-hidden">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] px-4 py-3 rounded-2xl ${
              message.role === "user"
                ? "bg-[#7954A3] rounded-br-md"
                : "bg-[#E4D7F1] rounded-bl-md"
            }`}
          >
            <div className={`text-sm break-words prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:p-2 prose-pre:rounded-lg ${
              message.role === "user"
                ? "text-white prose-p:text-white prose-headings:text-white prose-strong:text-white prose-li:text-white prose-code:text-white prose-code:bg-white/20 prose-pre:bg-white/20"
                : "text-black prose-p:text-black prose-headings:text-black prose-strong:text-black prose-li:text-black prose-code:text-black prose-code:bg-black/10 prose-pre:bg-black/10"
            }`}>
              <ReactMarkdown
                components={{
                  a: ({ href, children }) => (
                    <Link
                      href={href || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:opacity-80"
                    >
                      {children}
                    </Link>
                  ),
                }}
              >
                {message.role === "assistant" ? transformProductLinks(message.content) : message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse" />
              )}
            </div>
          </div>
        </div>
      ))}

      {isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming && (
        <div className="flex justify-start">
          <div className="bg-[#E4D7F1] text-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-[#7954A3] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-[#7954A3] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-[#7954A3] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
