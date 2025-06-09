import { useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatError } from "./chat-error";
import { ChatLoading } from "./chat-loading";
import { ChatEmpty } from "./chat-empty";
import { JumpToBottom } from "./jump-to-bottom";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useChatMessages } from "@/hooks/use-chat-messages";

interface ChatProps {
  initialMessages?: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
    processedContent?: string;
  }>;
}

export function Chat({ initialMessages }: ChatProps) {
  const {
    messages,
    status,
    error,
    handleSendMessage,
    handleMessageRetry,
    handleGlobalRetry,
    handleStop,
  } = useChatMessages({ initialMessages });

  const {
    isAtBottom,
    shouldAutoScroll,
    messagesEndRef,
    scrollAreaRef,
    handleScroll,
    jumpToBottom,
    enableAutoScroll,
    scrollToBottom,
  } = useChatScroll();

  useEffect(() => {
    if (shouldAutoScroll || status === "streaming") {
      scrollToBottom();
    }
  }, [messages, status, shouldAutoScroll, scrollToBottom]);

  async function handleSendMessageWithAutoScroll(content: string) {
    enableAutoScroll();
    await handleSendMessage(content);
  }

  function handleMessageRetryWithAutoScroll(messageId: string) {
    enableAutoScroll();
    handleMessageRetry(messageId);
  }

  function handleGlobalRetryWithAutoScroll() {
    enableAutoScroll();
    handleGlobalRetry();
  }

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto min-h-0"
        onScroll={handleScroll}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              onRetry={handleMessageRetryWithAutoScroll}
              canRetry={status !== "streaming"}
            />
          ))}

          {status === "streaming" && <ChatLoading />}
          {error && <ChatError error={error} />}
          {messages.length === 0 && <ChatEmpty />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {!isAtBottom && <JumpToBottom onClick={jumpToBottom} />}

      <div className="flex-shrink-0 border-t bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            onSendMessage={handleSendMessageWithAutoScroll}
            disabled={status === "streaming"}
            status={status}
            error={error}
            onStop={handleStop}
            onRetry={handleGlobalRetryWithAutoScroll}
          />
        </div>
      </div>
    </div>
  );
}
