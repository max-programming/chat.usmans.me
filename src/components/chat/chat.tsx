import { useEffect, useState } from "react";
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

  // State to track which version is being shown for each group of consecutive assistant messages
  const [versionStates, setVersionStates] = useState<Record<string, number>>(
    {}
  );

  // Group consecutive assistant messages
  const processedMessages = (() => {
    const result: Array<{
      type: "single" | "group";
      message?: (typeof messages)[0];
      messages?: typeof messages;
      groupId?: string;
    }> = [];

    let i = 0;
    while (i < messages.length) {
      const currentMessage = messages[i];

      if (currentMessage.role === "assistant") {
        // Look for consecutive assistant messages
        const groupMessages = [currentMessage];
        let j = i + 1;

        while (j < messages.length && messages[j].role === "assistant") {
          groupMessages.push(messages[j]);
          j++;
        }

        if (groupMessages.length > 1) {
          // Multiple consecutive assistant messages - treat as versions
          const groupId = `group-${i}`;
          result.push({
            type: "group",
            messages: groupMessages,
            groupId,
          });
        } else {
          // Single assistant message
          result.push({
            type: "single",
            message: currentMessage,
          });
        }

        i = j;
      } else {
        // User message
        result.push({
          type: "single",
          message: currentMessage,
        });
        i++;
      }
    }

    return result;
  })();

  function handleVersionChange(groupId: string, newVersionIndex: number) {
    setVersionStates(prev => ({
      ...prev,
      [groupId]: newVersionIndex,
    }));
  }

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
      <ChatHeader title={isNew ? generatedTitle : chat.title} chatId={chatId} />
      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full bg-background relative">
          <div
            ref={scrollAreaRef}
            className="flex-1 overflow-y-auto min-h-0"
            onScroll={handleScroll}
          >
            <div className="max-w-4xl mx-auto px-3 py-3 space-y-4 sm:px-4 sm:py-4">
              {processedMessages.map((item, index) => {
                if (item.type === "single") {
                  return (
                    <ChatMessage
                      key={item.message!.id}
                      message={item.message!}
                      onRetry={handleMessageRetryWithAutoScroll}
                      canRetry={status !== "streaming"}
                    />
                  );
                } else {
                  // Group of consecutive assistant messages
                  const groupId = item.groupId!;
                  const currentVersionIndex = versionStates[groupId] ?? 0;
                  const currentMessage = item.messages![currentVersionIndex];

                  return (
                    <ChatMessage
                      key={`${groupId}-${currentVersionIndex}`}
                      message={currentMessage}
                      onRetry={handleMessageRetryWithAutoScroll}
                      canRetry={status !== "streaming"}
                      hasMultipleVersions={true}
                      currentVersionIndex={currentVersionIndex}
                      totalVersions={item.messages!.length}
                      onPreviousVersion={() =>
                        handleVersionChange(
                          groupId,
                          Math.max(0, currentVersionIndex - 1)
                        )
                      }
                      onNextVersion={() =>
                        handleVersionChange(
                          groupId,
                          Math.min(
                            item.messages!.length - 1,
                            currentVersionIndex + 1
                          )
                        )
                      }
                    />
                  );
                }
              })}

              {status === "streaming" ||
                (status === "submitted" && <ChatLoading />)}
              {error && <ChatError error={error} />}
              {messages.length === 0 && <ChatEmpty />}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {!isAtBottom && <JumpToBottom onClick={jumpToBottom} />}

          <div className="flex-shrink-0 border-t bg-background">
            <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
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
