import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Square, RotateCcw } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

interface ChatInputProps {
  onSendMessage(message: string): void;
  disabled?: boolean;
  status?: "submitted" | "streaming" | "ready" | "error";
  error?: Error;
  onStop?: () => void;
  onRetry?: () => void;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  status = "ready",
  error,
  onStop,
  onRetry,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const pathname = useLocation({ select: l => l.pathname });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim() && !disabled && status !== "streaming") {
      onSendMessage(message.trim());
      setMessage("");
    }
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, [pathname]);

  const isStreaming = status === "streaming";
  const hasError = !!error;
  const canSendMessage = !disabled && !isStreaming;

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
          disabled={disabled}
          className="min-h-[50px] max-h-[120px] resize-none"
          rows={1}
          ref={textareaRef}
          autoFocus
        />
      </div>

      <div className="flex gap-2 items-end">
        {hasError && !isStreaming && (
          <Button
            type="button"
            onClick={onRetry}
            size="icon"
            variant="outline"
            className="h-[50px] w-[50px] flex-shrink-0"
            title="Retry last message"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {isStreaming ? (
          <Button
            type="button"
            onClick={onStop}
            size="icon"
            variant="secondary"
            className="h-[50px] w-[50px] flex-shrink-0"
            title="Stop generating"
          >
            <Square className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={!message.trim() || !canSendMessage}
            size="icon"
            className="h-[50px] w-[50px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
