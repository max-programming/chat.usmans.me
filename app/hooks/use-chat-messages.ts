import { useNewChat } from "@/lib/mutations/use-new-chat";
import { useNewMessage } from "@/lib/mutations/use-new-message";
import { useUpdateChatTitle } from "@/lib/mutations/use-update-chat-title";
import { chatStore, startNewChat } from "@/lib/stores/chat.store";
import { useChat, type Message } from "@ai-sdk/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

interface UseChatMessagesProps {
  initialMessages?: Message[];
  chatId?: string;
}

export function useChatMessages({
  initialMessages = [],
  chatId,
}: UseChatMessagesProps) {
  const isNew = useStore(chatStore, s => s.isNew);

  const pathname = useLocation({ select: l => l.pathname });
  const navigate = useNavigate();

  const { mutate: newMessage } = useNewMessage();
  const { mutate: newChat } = useNewChat();
  const { mutate: updateChatTitle } = useUpdateChatTitle();

  const { messages, append, status, error, reload, stop, setMessages, id } =
    useChat({
      initialMessages,
      id: chatId,
      onFinish(message, options) {
        newMessage({
          chatId: id,
          content: message.content,
          role: message.role,
          tokenCount: options.usage.completionTokens,
          messageId: message.id,
        });
      },
      onResponse: response => {
        console.log("Chat API Response:", response.status, response.statusText);
      },
      onError: error => {
        console.error("Chat Error:", error);
      },
    });

  function handleGlobalRetry() {
    if (error) {
      reload();
    }
  }

  function handleStop() {
    if (status === "streaming") {
      stop();
    }
  }

  async function handleSendMessage(content: string) {
    if (pathname === "/") {
      const newChatId = startNewChat(content);
      navigate({
        to: "/chat/$chatId",
        params: { chatId: newChatId },
        search: { isNew: true },
      });
    } else {
      const promises = [];
      if (isNew) {
        promises.push(newChat({ chatId: id, message: content }));
      } else {
        promises.push(
          newMessage({
            chatId: id,
            content,
            role: "user",
          })
        );
      }
      promises.push(
        append({
          role: "user",
          content,
        })
      );
      await Promise.all(promises);
    }
  }

  function handleMessageRetry(messageId: string) {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const messageToRetry = messages[messageIndex];

    if (messageToRetry.role === "assistant") {
      const truncatedMessages = messages.slice(0, messageIndex);
      setMessages(truncatedMessages);

      if (truncatedMessages.length > 0) {
        const lastMessage = truncatedMessages[truncatedMessages.length - 1];
        if (lastMessage.role === "user") {
          setTimeout(() => {
            reload();
          }, 0);
        }
      }
    } else {
      const truncatedMessages = messages.slice(0, messageIndex);
      setMessages(truncatedMessages);
    }
  }

  return {
    messages,
    status,
    error,
    handleSendMessage,
    handleMessageRetry,
    handleGlobalRetry,
    handleStop,
  };
}
