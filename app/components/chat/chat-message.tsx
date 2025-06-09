import { cn } from "@/lib/utils";
import { Copy, RotateCcw } from "lucide-react";
import type { Message } from "@/hooks/use-chat-messages";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "../ui/button";
import { StreamingMarkdown } from "../ui/streaming-markdown";

interface ChatMessageProps {
  message: Message & { processedContent?: string };
  onRetry?(messageId: string): void;
  canRetry?: boolean;
  isStreaming?: boolean;
}

export function ChatMessage({
  message,
  onRetry,
  canRetry = false,
  isStreaming = false,
}: ChatMessageProps) {
  const [, copyToClipboard] = useCopyToClipboard();
  const isUser = message.role === "user";

  function handleCopyToClipboard() {
    copyToClipboard(message.content);
  }

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-xs lg:max-w-md">
          <div className="rounded-lg p-3 bg-zinc-800 text-zinc-100">
            {message.role === "user" ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            ) : (
              <StreamingMarkdown
                content={message.content}
                processedContent={message.processedContent}
                isStreaming={isStreaming}
                className="text-sm"
              />
            )}
            <p className="text-xs mt-1 opacity-70">
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex mt-2 gap-1 justify-end mr-2">
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
                title="Retry from this point"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2">
        <StreamingMarkdown
          content={message.content}
          processedContent={message.processedContent}
          isStreaming={isStreaming && message.role === "assistant"}
        />
        <p className="text-xs mt-2 opacity-70">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="flex mt-2 gap-1 justify-start">
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
            title="Retry from this message"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
