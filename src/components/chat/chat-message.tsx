import { Copy, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useCopyToClipboard } from "usehooks-ts";
import { Button } from "../ui/button";
import { Markdown } from "../ui/markdown";
import type { ExtendedMessage } from "@/hooks/use-chat-messages";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ChatMessageProps {
  message: ExtendedMessage;
  onRetry?(messageId: string): void;
  canRetry?: boolean;
  isPastMessageAssistant?: boolean;
  onPreviousVersion?(): void;
  onNextVersion?(): void;
  currentVersionIndex?: number;
  totalVersions?: number;
  hasMultipleVersions?: boolean;
}

export function ChatMessage({
  message,
  onRetry,
  canRetry = false,
  isPastMessageAssistant = false,
  onPreviousVersion,
  onNextVersion,
  currentVersionIndex,
  totalVersions,
  hasMultipleVersions = false,
}: ChatMessageProps) {
  const [, copyToClipboard] = useCopyToClipboard();
  const isUser = message.role === "user";

  function handleCopyToClipboard() {
    copyToClipboard(message.content);
  }

  if (isUser) {
    return (
      <TooltipProvider>
        <div className="flex justify-end wrap-break-word">
          <div className="max-w-xs lg:max-w-md">
            <div className="rounded-lg p-3 bg-muted">
              <Markdown content={message.content} className="text-sm" />
              <p className="text-xs mt-1 opacity-70">
                {message.createdAt?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="flex mt-2 gap-1 justify-end mr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleCopyToClipboard}
                    variant="ghost"
                    size="icon"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy to clipboard</p>
                </TooltipContent>
              </Tooltip>

              {onRetry && canRetry && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => onRetry(message.id)}
                      variant="ghost"
                      size="icon"
                      title="Retry from this point"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Retry from this point</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-2">
        <Markdown content={message.content} />
        <p className="text-xs mt-2 opacity-70">
          {message.createdAt?.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {hasMultipleVersions && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground">
              Version {currentVersionIndex! + 1} of {totalVersions}
            </span>
            <div className="flex items-center gap-1 ml-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onPreviousVersion}
                      variant="ghost"
                      size="sm"
                      disabled={currentVersionIndex === 0}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Previous version</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={onNextVersion}
                      variant="ghost"
                      size="sm"
                      disabled={currentVersionIndex === totalVersions! - 1}
                      className="h-6 w-6 p-0"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Next version</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>

      <div className="flex mt-2 gap-1 justify-start items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleCopyToClipboard}
                variant="ghost"
                size="icon"
                title="Copy to clipboard"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {onRetry && canRetry && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onRetry(message.id)}
                  variant="ghost"
                  size="icon"
                  title="Retry from this message"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Retry from this message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <span className="text-xs text-muted-foreground">
          {message.modelName}
        </span>
      </div>
    </div>
  );
}
