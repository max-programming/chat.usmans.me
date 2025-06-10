import { useChat } from "@ai-sdk/react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  processedContent?: string;
}

interface UseChatMessagesProps {
  initialMessages?: Message[];
}

export function useChatMessages({
  initialMessages = [],
}: UseChatMessagesProps = {}) {
  const { messages, append, status, error, reload, stop, setMessages } =
    useChat({
      initialMessages,
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
    await append({
      role: "user",
      content,
    });
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

  const messagesWithTimestamps: Message[] = messages.map((msg, index) => {
    // Find corresponding initial message with processedContent
    const initialMessage = initialMessages.find(
      initial => initial.id === msg.id
    );

    return {
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant",
      timestamp:
        initialMessage?.timestamp ||
        new Date(Date.now() - (messages.length - index) * 60000),
      processedContent: initialMessage?.processedContent,
    };
  });

  return {
    messages: messagesWithTimestamps,
    status,
    error,
    handleSendMessage,
    handleMessageRetry,
    handleGlobalRetry,
    handleStop,
  };
}
