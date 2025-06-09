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
      initialMessages:
        initialMessages.length > 0
          ? initialMessages.map(msg => ({
              id: msg.id,
              content: msg.content,
              role: msg.role,
            }))
          : [
              {
                id: "demo-2",
                content:
                  "Hi there! Can you help me understand how React hooks work?",
                role: "user",
              },
              {
                id: "demo-3",
                content:
                  "Absolutely! React hooks are functions that let you use state and other React features in functional components. The most common ones are:\n\n• `useState` - for managing component state\n• `useEffect` - for side effects and lifecycle events\n• `useContext` - for consuming context\n• `useMemo` and `useCallback` - for performance optimization\n\nWould you like me to explain any of these in more detail?",
                role: "assistant",
              },
              {
                id: "demo-4",
                content:
                  "That's really helpful! Can you show me a simple useState example?",
                role: "user",
              },
              {
                id: "demo-5",
                content:
                  "Sure! Here's a simple counter example using useState:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```\n\nThe `useState` hook returns an array with two elements: the current state value and a function to update it. You can destructure these into meaningful variable names.",
                role: "assistant",
              },
            ],
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
