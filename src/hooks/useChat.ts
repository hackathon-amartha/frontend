"use client";

import { useState, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import type { Thread, Message } from "@/types/chat";
import * as chatService from "@/services/chat";

interface LocalMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

interface UseChatReturn {
  messages: LocalMessage[];
  threads: Thread[];
  currentThreadId: string | null;
  currentThreadTitle: string | null;
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (message: string, audio?: Blob) => Promise<void>;
  loadThread: (threadId: string) => Promise<void>;
  loadThreads: () => Promise<void>;
  newThread: () => void;
  deleteThread: (threadId: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const [currentThreadTitle, setCurrentThreadTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadThreads = useCallback(async () => {
    try {
      const fetchedThreads = await chatService.getThreads();
      setThreads(fetchedThreads);
    } catch (err) {
      console.error("Failed to load threads:", err);
    }
  }, []);

  const loadThread = useCallback(async (threadId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.getThread(threadId);
      setCurrentThreadId(threadId);
      setCurrentThreadTitle(data.thread.title);
      setMessages(
        data.messages.map((msg: Message) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load thread");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const newThread = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setCurrentThreadId(null);
    setCurrentThreadTitle(null);
    setMessages([]);
    setError(null);
    setIsStreaming(false);
  }, []);

  const deleteThread = useCallback(
    async (threadId: string) => {
      try {
        await chatService.deleteThread(threadId);
        setThreads((prev) => prev.filter((t) => t.id !== threadId));
        if (currentThreadId === threadId) {
          newThread();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete thread");
      }
    },
    [currentThreadId, newThread]
  );

  const sendMessage = useCallback(
    async (message: string, audio?: Blob) => {
      if (!message.trim() && !audio) return;

      setIsLoading(true);
      setIsStreaming(true);
      setError(null);

      const userMessageId = `user-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: userMessageId, role: "user", content: message },
      ]);

      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "", isStreaming: true },
      ]);

      const contentRef = { current: "" };
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await chatService.sendMessage(
          message,
          currentThreadId,
          audio,
          {
            onThreadCreated: (threadId) => {
              setCurrentThreadId(threadId);
              loadThreads();
            },
            onChunk: (chunkContent) => {
              contentRef.current += chunkContent;
              console.log("[DEBUG] onChunk called, accumulated:", contentRef.current.length);
              flushSync(() => {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: contentRef.current }
                      : msg
                  )
                );
              });
            },
            onTitleGenerated: (title) => {
              setCurrentThreadTitle(title);
              loadThreads();
            },
            onDone: (fullContent) => {
              console.log("[DEBUG] onDone called with full content length:", fullContent?.length);
              flushSync(() => {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? { ...msg, content: fullContent || contentRef.current, isStreaming: false }
                      : msg
                  )
                );
              });
            },
            onError: (errorMsg) => {
              setError(errorMsg);
            },
          },
          controller
        );
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to send message");
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [currentThreadId, loadThreads]
  );

  return {
    messages,
    threads,
    currentThreadId,
    currentThreadTitle,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    loadThread,
    loadThreads,
    newThread,
    deleteThread,
    clearError,
  };
}
