import { ChatMessage } from "./chat-message";
import { ChatEmpty } from "./chat-empty";
import { JumpToBottom } from "./jump-to-bottom";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { Badge } from "../ui/badge";
import { Globe, MessageCircle } from "lucide-react";

interface SharedChatProps {
  shareId: string;
}

export function SharedChat({ shareId }: SharedChatProps) {
  const {
    data: { chat, messages },
  } = useSuspenseQuery({
    ...queries.chats.publicWithMessages(shareId),
    retry: false,
  });

  const {
    isAtBottom,
    messagesEndRef,
    scrollAreaRef,
    handleScroll,
    jumpToBottom,
  } = useChatScroll();

  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <div className="flex-shrink-0 flex justify-between items-center p-2 pb-2 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 border-border/50 sm:p-4 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight truncate">
                {chat.title}
              </h1>
              <p className="text-xs text-muted-foreground">
                Shared AI Conversation
              </p>
            </div>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="flex items-center gap-1 text-xs px-2 py-1 sm:px-3 sm:py-1"
        >
          <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span className="hidden sm:inline">Public</span>
        </Badge>
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full bg-background relative">
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto min-h-0"
            onScroll={handleScroll}
          >
            <div className="max-w-4xl mx-auto px-3 py-3 space-y-4 sm:px-4 sm:py-4">
              {messages.length === 0 ? (
                <ChatEmpty />
              ) : (
                messages.map(message => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    canRetry={false}
                  />
                ))
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {!isAtBottom && <JumpToBottom onClick={jumpToBottom} />}

          <div className="flex-shrink-0 border-t bg-muted/50">
            <div className="max-w-4xl mx-auto px-3 py-2 sm:px-4 sm:py-3">
              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>
                    This is a read-only shared chat. You cannot send messages.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
