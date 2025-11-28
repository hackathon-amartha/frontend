import { createClient } from "@/lib/supabase/client";

const STT_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

async function getToken(): Promise<string | null> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token ?? null;
}

export interface STTStreamCallbacks {
  onThreadCreated?: (threadId: string) => void;
  onTranscript?: (transcript: string) => void;
  onChunk?: (chunk: string) => void;
  onTitleGenerated?: (title: string) => void;
  onDone?: (fullResponse: string) => void;
  onError?: (error: string) => void;
}

export async function sendAudioStreaming(
  audioBlob: Blob,
  threadId: string | null,
  callbacks: STTStreamCallbacks,
  abortController?: AbortController
): Promise<void> {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");
  if (threadId) {
    formData.append("thread_id", threadId);
  }

  const response = await fetch(`${STT_API_BASE}/stt/groq_stream`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    signal: abortController?.signal,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const event = JSON.parse(line.slice(6));

          switch (event.type) {
            case "thread_created":
              callbacks.onThreadCreated?.(event.thread_id);
              break;
            case "transcript":
              callbacks.onTranscript?.(event.content);
              break;
            case "chunk":
              callbacks.onChunk?.(event.content);
              break;
            case "title_generated":
              callbacks.onTitleGenerated?.(event.title);
              break;
            case "done":
              callbacks.onDone?.(event.content);
              break;
            case "error":
              callbacks.onError?.(event.content);
              break;
          }
        } catch (e) {
          console.error("Failed to parse SSE event:", e);
        }
      }
    }
  }
}

export async function sendAudioSimple(audioBlob: Blob): Promise<{
  transcript: string;
  llm_raw: unknown;
  llm_text: string;
}> {
  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.webm");

  const response = await fetch(`${STT_API_BASE}/stt/groq_simple`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
