"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

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

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
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
          Start a Conversation
        </h3>
        <p className="text-sm text-zinc-500 max-w-[250px]">
          Ask me anything about loans, applications, or any questions you have.
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
                ? "bg-blue-600 text-white rounded-br-md"
                : "bg-zinc-100 text-zinc-800 rounded-bl-md"
            }`}
          >
            <div className="text-sm break-words prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-pre:my-2 prose-code:bg-zinc-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-zinc-200 prose-pre:p-2 prose-pre:rounded-lg [&_*]:text-inherit">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {message.isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-current animate-pulse" />
              )}
            </div>
          </div>
        </div>
      ))}

      {isLoading && messages.length > 0 && !messages[messages.length - 1]?.isStreaming && (
        <div className="flex justify-start">
          <div className="bg-zinc-100 text-zinc-800 px-4 py-3 rounded-2xl rounded-bl-md">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
