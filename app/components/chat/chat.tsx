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
import { useGenerateTitle } from "@/hooks/use-generate-title";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import { ChatHeader } from "./chat-header";

interface ChatProps {
  chatId: string;
}

export function Chat({ chatId }: ChatProps) {
  const { initialMessage, isNew } = useStore(chatStore, s => ({
    initialMessage: s.initialMessage,
    isNew: s.isNew,
  }));

  const {
    data: { chat, messages: initialMessages },
  } = useSuspenseQuery(queries.chats.withMessages(chatId, isNew));

  const { complete: generateTitle, completion: generatedTitle } =
    useGenerateTitle(chat.id);

  const {
    messages,
    status,
    error,
    handleSendMessage,
    handleMessageRetry,
    handleGlobalRetry,
    handleStop,
  } = useChatMessages({ initialMessages, chatId: chat.id });

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
    (async () => {
      await handleSendMessage(initialMessage);
      generateTitle(initialMessage);
    })();
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
    <>
      <ChatHeader title={isNew ? generatedTitle : chat.title} />
      <div className="flex-1 min-h-0">
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
      </div>
    </>
  );
}
