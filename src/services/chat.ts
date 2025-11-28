import { createClient } from "@/lib/supabase/client";
import { fetchEventSource } from "@sentool/fetch-event-source";
import type { Thread, ThreadWithMessages, Message, SSEEvent } from "@/types/chat";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export interface SendMessageCallbacks {
  onThreadCreated?: (threadId: string) => void;
  onChunk?: (content: string) => void;
  onTitleGenerated?: (title: string) => void;
  onDone?: (fullContent?: string) => void;
  onError?: (error: string) => void;
}

// Helper to convert Blob to base64
async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function sendMessage(
  message: string,
  threadId: string | null | undefined,
  audio: Blob | undefined,
  callbacks: SendMessageCallbacks,
  abortController?: AbortController
): Promise<void> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  // Build JSON body
  const body: { message: string; thread_id?: string; audio_base64?: string } = {
    message,
  };
  if (threadId) {
    body.thread_id = threadId;
  }
  if (audio) {
    body.audio_base64 = await blobToBase64(audio);
  }

  console.log("[DEBUG] Sending request:", { url: `${API_BASE}/chat/send`, body, token: token ? "present" : "missing" });

  await fetchEventSource(`${API_BASE}/chat/send`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: abortController?.signal,
    onopen: async (response) => {
      console.log("[DEBUG] SSE connection opened, status:", response.status, "content-type:", response.headers.get("content-type"));
      if (!response.ok) {
        const text = await response.text();
        console.error("SSE Error Response:", response.status, text);
        throw new Error(`HTTP error! status: ${response.status} - ${text}`);
      }
    },
    onmessage: (event) => {
      console.log("[DEBUG] SSE message received:", event);
      if (!event.data) {
        console.log("[DEBUG] No event.data");
        return;
      }

      // The library already parses JSON, so event.data may be an object or string
      const data: SSEEvent = typeof event.data === "string"
        ? JSON.parse(event.data)
        : event.data;

      console.log("[DEBUG] SSE data:", data);

      switch (data.type) {
        case "thread_created":
          if (data.thread_id) {
            console.log("[DEBUG] Thread created:", data.thread_id);
            callbacks.onThreadCreated?.(data.thread_id);
          }
          break;
        case "chunk":
          if (data.content) {
            console.log("[DEBUG] Chunk received:", data.content);
            callbacks.onChunk?.(data.content);
          }
          break;
        case "title_generated":
          if (data.title) {
            console.log("[DEBUG] Title generated:", data.title);
            callbacks.onTitleGenerated?.(data.title);
          }
          break;
        case "done":
          console.log("[DEBUG] Stream done, full content length:", data.content?.length);
          callbacks.onDone?.(data.content);
          break;
        case "error":
          console.log("[DEBUG] Stream error:", data.content);
          callbacks.onError?.(data.content || "An error occurred");
          break;
      }
    },
    onclose: () => {
      console.log("[DEBUG] SSE connection closed");
    },
    onerror: (err) => {
      console.log("[DEBUG] SSE onerror:", err);
      callbacks.onError?.(err instanceof Error ? err.message : "Stream error");
      throw err;
    },
  });
}

export async function getThreads(): Promise<Thread[]> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/chat/threads`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getThread(threadId: string): Promise<ThreadWithMessages> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/chat/threads/${threadId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function deleteThread(threadId: string): Promise<void> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/chat/threads/${threadId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}

export async function getMessages(threadId: string): Promise<Message[]> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_BASE}/chat/threads/${threadId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
