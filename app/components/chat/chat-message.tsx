import { cn } from "@/lib/utils";
import { Copy, RotateCcw } from "lucide-react";
import type { Message } from "@/hooks/use-chat-messages";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "../ui/button";

interface ChatMessageProps {
  message: Message;
  onRetry?(messageId: string): void;
  canRetry?: boolean;
}

export function ChatMessage({
  message,
  onRetry,
  canRetry = false,
}: ChatMessageProps) {
  const [, copyToClipboard] = useCopyToClipboard();
  const isUser = message.role === "user";

  function handleCopyToClipboard() {
    copyToClipboard(message.content);
  }

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div className="max-w-xs lg:max-w-md">
        <div
          className={cn(
            "rounded-lg p-3",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}
        >
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p className={cn("text-xs mt-1 opacity-70")}>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div
          className={cn(
            "flex mt-2 gap-1",
            isUser ? "justify-end mr-2" : "justify-start ml-2"
          )}
        >
          <Button
            onClick={handleCopyToClipboard}
            variant="ghost"
            size="icon"
            title="Copy to clipboard"
          >
            <Copy className="w-3 h-3" />
          </Button>

          {onRetry && canRetry && (
            <Button
              onClick={() => onRetry(message.id)}
              variant="ghost"
              size="icon"
              title={
                isUser ? "Retry from this point" : "Retry from this message"
              }
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
