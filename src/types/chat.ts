export interface Thread {
  id: string;
  user_id: string;
  title: string | null;
  system_instruction: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  thread_id: string;
  role: "user" | "assistant";
  content: string;
  audio_url: string | null;
  created_at: string;
}

export interface ThreadWithMessages {
  thread: Thread;
  messages: Message[];
}

export type SSEEventType =
  | "thread_created"
  | "chunk"
  | "title_generated"
  | "done"
  | "error";

export interface SSEEvent {
  type: SSEEventType;
  content?: string;
  thread_id?: string;
  title?: string;
}
