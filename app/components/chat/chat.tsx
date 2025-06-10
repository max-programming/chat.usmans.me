import { useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatError } from "./chat-error";
import { ChatLoading } from "./chat-loading";
import { ChatEmpty } from "./chat-empty";
import { JumpToBottom } from "./jump-to-bottom";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useChatMessages } from "@/hooks/use-chat-messages";
import { useStore } from "@tanstack/react-store";
import { chatStore } from "@/lib/stores/chat.store";
import { useSingleEffect } from "@/hooks/use-single-effect";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";

interface ChatProps {
  chatId: string;
  initialMessages?: ChatWithMessages["messages"];
}

export function Chat({ initialMessages, chatId }: ChatProps) {
  const { initialMessage, isNew } = useStore(chatStore);

  const {
    messages,
    status,
    error,
    handleSendMessage,
    handleMessageRetry,
    handleGlobalRetry,
    handleStop,
  } = useChatMessages({ initialMessages, chatId });

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
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, status, shouldAutoScroll, scrollToBottom]);

  useSingleEffect(() => {
    if (!isNew) return;
    if (initialMessage.trim() === "") return;
    handleSendMessage(initialMessage);
  });

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

          {status === "streaming" ||
            (status === "submitted" && <ChatLoading />)}
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
