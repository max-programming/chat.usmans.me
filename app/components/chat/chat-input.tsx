import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Send, Square, RotateCcw, ChevronDown, Check } from "lucide-react";
import { useLocation } from "@tanstack/react-router";
import { models } from "@/lib/models";
import { useLocalStorage } from "usehooks-ts";
import type { ModelConfig } from "@/hooks/use-chat-messages";

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
  const [selectedModel, setSelectedModel] = useLocalStorage<ModelConfig>(
    "model-config",
    {
      provider: "openai",
      model: "gpt-4o-mini",
    }
  );
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

  function handleModelSelect(model: ModelConfig) {
    setSelectedModel(model);
  }

  useEffect(() => {
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  }, [pathname]);

  const isStreaming = status === "streaming";
  const hasError = !!error;
  const canSendMessage = !disabled && !isStreaming && message.trim();
  const currentModel =
    models.find(m => m.id === selectedModel.model) ?? models[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative bg-card border border-border rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl focus-within:shadow-xl focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1 relative min-w-0">
              <Textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything... (Press Enter to send, Shift+Enter for new line)"
                disabled={disabled}
                className="min-h-[60px] max-h-[160px] resize-none border-0 !bg-card focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base leading-relaxed p-0 placeholder:text-muted-foreground shadow-none break-words"
                rows={1}
                ref={textareaRef}
                autoFocus
              />

              {/* Character indicator for long messages */}
              {message.length > 1000 && (
                <div className="absolute bottom-1 right-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {message.length}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Model Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-10 px-3 rounded-full border border-border hover:bg-muted/50 transition-colors"
                  >
                    <currentModel.icon
                      className="h-4 w-4"
                      color={currentModel.color}
                    />
                    <span className="text-sm">{currentModel.name}</span>
                    <ChevronDown className="h-3 w-3 ml-1 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>Select AI Model</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {models.map(model => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() =>
                        handleModelSelect({
                          model: model.id,
                          provider: model.provider,
                        })
                      }
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <model.icon
                        className="h-4 w-4 flex-shrink-0"
                        color={model.color}
                      />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {model.providerDisplayName}
                        </div>
                      </div>
                      {selectedModel.model === model.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Error state with retry button */}
              {hasError && !isStreaming && (
                <Button
                  type="button"
                  onClick={onRetry}
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Retry last message"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              {/* Stop button when streaming */}
              {isStreaming ? (
                <Button
                  type="button"
                  onClick={onStop}
                  size="sm"
                  className="h-10 w-10 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
                  title="Stop generating"
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                /* Send button */
                <Button
                  type="submit"
                  disabled={!canSendMessage}
                  size="sm"
                  className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground shadow-md transition-all duration-200 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:shadow-none"
                  title={
                    canSendMessage ? "Send message" : "Type a message to send"
                  }
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Status indicator */}
        {status === "submitted" && (
          <div className="absolute bottom-2 left-4 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Sending...
          </div>
        )}

        {isStreaming && (
          <div className="absolute bottom-2 left-4 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              <div
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-primary rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
            AI is typing...
          </div>
        )}

        {hasError && (
          <div className="absolute bottom-2 left-4 flex items-center gap-2 text-sm text-destructive">
            <div className="w-2 h-2 bg-destructive rounded-full"></div>
            Failed to send message
          </div>
        )}
      </div>

      {/* Helpful shortcuts */}
      <div className="flex justify-center mt-3 text-xs text-muted-foreground">
        <span>
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
            Enter
          </kbd>{" "}
          to send •{" "}
          <kbd className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
            Shift + Enter
          </kbd>{" "}
          for new line
        </span>
      </div>
    </div>
  );
}
