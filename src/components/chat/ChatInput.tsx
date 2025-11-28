"use client";

import { useState, useRef, KeyboardEvent, useCallback, useEffect } from "react";

interface ChatInputProps {
  onSend: (message: string, audio?: Blob) => void;
  onSendAudio?: (audio: Blob) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function ChatInput({ onSend, onSendAudio, disabled, isStreaming }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [micPermission, setMicPermission] = useState<"prompt" | "granted" | "denied">("prompt");
  const [showPermissionError, setShowPermissionError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check microphone permission on mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: "microphone" as PermissionName });
        setMicPermission(result.state as "prompt" | "granted" | "denied");

        result.onchange = () => {
          setMicPermission(result.state as "prompt" | "granted" | "denied");
        };
      } catch {
        // Safari doesn't support permissions.query for microphone
        // We'll check when user tries to record
        setMicPermission("prompt");
      }
    };

    checkMicPermission();
  }, []);

  const handleSubmit = () => {
    if (message.trim() && !disabled && !isStreaming) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const startRecording = useCallback(async () => {
    // Check if already denied
    if (micPermission === "denied") {
      setShowPermissionError(true);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicPermission("granted");
      setShowPermissionError(false);

      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingDuration(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setMicPermission("denied");
        setShowPermissionError(true);
      }
    }
  }, [micPermission]);

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        resolve(new Blob());
        return;
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        resolve(audioBlob);
      };

      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      setIsRecording(false);
      setRecordingDuration(0);
    });
  }, []);

  const cancelRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }

    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
  }, []);

  const handleRecordingToggle = useCallback(async () => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob.size > 0) {
        if (onSendAudio) {
          onSendAudio(audioBlob);
        } else {
          onSend("", audioBlob);
        }
      }
    } else {
      startRecording();
    }
  }, [isRecording, stopRecording, startRecording, onSend, onSendAudio]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="border-t border-zinc-200 p-4 bg-white">
      {showPermissionError && (
        <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="text-sm text-amber-800">
              Microphone access denied. Please enable it in your browser settings.
            </span>
          </div>
          <button
            onClick={() => setShowPermissionError(false)}
            className="text-amber-600 hover:text-amber-800"
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
      {isRecording ? (
        <div className="flex items-center gap-3">
          <button
            onClick={cancelRecording}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-200 text-zinc-600 rounded-full hover:bg-zinc-300 transition-colors"
            title="Cancel recording"
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

          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-red-50 rounded-2xl">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-600">
              Recording... {formatDuration(recordingDuration)}
            </span>
          </div>

          <button
            onClick={handleRecordingToggle}
            disabled={disabled || isStreaming}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Stop and send"
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
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <button
            onClick={handleRecordingToggle}
            disabled={disabled || isStreaming}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-zinc-100 text-zinc-600 rounded-full hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Record audio"
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
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleInput();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={disabled || isStreaming}
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-zinc-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors text-sm text-zinc-800 placeholder:text-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ maxHeight: "120px" }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!message.trim() || disabled || isStreaming}
            className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed transition-colors"
          >
            {isStreaming ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
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
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      )}
      <p className="text-xs text-zinc-400 mt-2 text-center">
        {isRecording
          ? "Tap send to finish, or X to cancel"
          : "Press Enter to send, Shift+Enter for new line"}
      </p>
    </div>
  );
}
