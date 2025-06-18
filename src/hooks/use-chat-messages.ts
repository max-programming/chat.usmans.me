import { models } from "@/lib/models";
import { useNewChat } from "@/lib/mutations/use-new-chat";
import { useNewMessage } from "@/lib/mutations/use-new-message";
import { chatStore, startNewChat } from "@/lib/stores/chat.store";
import { useChat, type Message } from "@ai-sdk/react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { useReadLocalStorage } from "usehooks-ts";
import type { AllowedModels, AllowedProviders } from "@/routes/api/chat";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { generateMessageId } from "@/server/messages/newMessage";

interface UseChatMessagesProps {
  initialMessages?: ChatWithMessages["messages"];
  chatId?: string;
}

export interface ModelConfig {
  provider: AllowedProviders;
  model: AllowedModels;
}

export function useChatMessages({
  initialMessages = [],
  chatId,
}: UseChatMessagesProps) {
  const isNew = useStore(chatStore, s => s.isNew);

  const pathname = useLocation({ select: l => l.pathname });
  const navigate = useNavigate();

  const { mutateAsync: newMessage } = useNewMessage();
  const { mutate: newChat } = useNewChat();

  const selectedModel = useReadLocalStorage<ModelConfig>("model-config");

  const { messages, append, status, error, reload, stop, setMessages, id } =
    useChat({
      initialMessages,
      id: chatId,
      body: {
        provider: selectedModel?.provider ?? "openai",
        model: selectedModel?.model ?? "gpt-4o-mini",
      },
      onFinish(message, options) {
        if (options.finishReason === "stop") {
          const modelName = models.find(
            m => m.id === (selectedModel?.model ?? "gpt-4o-mini")
          )?.name;
          newMessage({
            chatId: id,
            content: message.content,
            role: message.role,
            tokenCount: options.usage.completionTokens,
            messageId: message.id,
            modelName,
          });
        } else {
          console.log({ options });
        }
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
      const lastMessage = messages[messages.length - 1];
      const modelName = models.find(
        m => m.id === (selectedModel?.model ?? "gpt-4o-mini")
      )?.name;
      newMessage({
        chatId: id,
        content: lastMessage.content,
        role: lastMessage.role,
        tokenCount: 0, // TODO: get token count somehow
        messageId: lastMessage.id,
        modelName,
      });
    }
  }

  async function handleSendMessage(content: string) {
    if (pathname === "/") {
      const newChatId = startNewChat(content);
      const newMessageId = generateMessageId();
      newChat({
        chatId: newChatId,
        message: content,
        messageId: newMessageId,
        timestamp: new Date(),
      });
      navigate({
        to: "/chat/$chatId",
        params: { chatId: newChatId },
        search: { isNew: true },
      });
    } else {
      if (isNew) {
        // start new chat with initial message
        reload();
      } else {
        const messageId = generateMessageId();
        await Promise.all([
          append({ id: messageId, role: "user", content }),
          newMessage({ chatId: id, content, role: "user", messageId }),
        ]);
      }
    }
  }

  async function handleMessageRetry(messageId: string) {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;

    const messageToRetry = messages[messageIndex];
    const truncatedMessages = messages.slice(0, messageIndex);

    try {
      setMessages(truncatedMessages);

      if (messageToRetry.role === "assistant") {
        await new Promise(resolve => setTimeout(resolve, 0));
        reload();
      } else if (messageToRetry.role === "user") {
        await handleSendMessage(messageToRetry.content);
      }
    } catch (error) {
      console.error("Retry failed:", error);
    }
  }

  const extendedMessages = messages.map<ExtendedMessage>(message => {
    if (message.role === "user") return message as ExtendedMessage;
    const iMessage = initialMessages.find(m => m.id === message.id);
    return {
      ...message,
      modelName: iMessage?.modelName,
    };
  });

  return {
    messages: extendedMessages,
    status,
    error,
    handleSendMessage,
    handleMessageRetry,
    handleGlobalRetry,
    handleStop,
  };
}

export interface ExtendedMessage extends Message {
  modelName: string | null | undefined;
}
