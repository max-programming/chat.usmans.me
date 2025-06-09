import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function Chat() {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, append, status, error, reload, stop, setMessages } =
    useChat({
      initialMessages: [
        {
          id: "demo-1",
          content: "Hello! I'm your AI assistant. How can I help you today?",
          role: "assistant",
        },
        {
          id: "demo-2",
          content: "Hi there! Can you help me understand how React hooks work?",
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
      setShouldAutoScroll(true);
      reload();
    }
  }

  function handleStop() {
    if (status === "streaming") {
      stop();
    }
  }

  function scrollToBottom(smooth = true) {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "end",
    });
  }

  function checkIfAtBottom() {
    if (!scrollAreaRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const threshold = 100;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }

  function handleScroll() {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);

    if (!atBottom) {
      setShouldAutoScroll(false);
    }
  }

  useEffect(() => {
    if (shouldAutoScroll || status === "streaming") {
      scrollToBottom();
    }
  }, [messages, status, shouldAutoScroll]);

  useEffect(() => {
    if (isAtBottom) {
      setShouldAutoScroll(true);
    }
  }, [isAtBottom]);

  async function handleSendMessage(content: string) {
    setShouldAutoScroll(true);
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
          setShouldAutoScroll(true);
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

  function handleJumpToBottom() {
    setShouldAutoScroll(true);
    scrollToBottom();
  }

  const messagesWithTimestamps: Message[] = messages.map((msg, index) => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as "user" | "assistant",
    timestamp: new Date(Date.now() - (messages.length - index) * 60000),
  }));

  return (
    <div className="flex flex-col h-full bg-background relative">
      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto min-h-0"
        onScroll={handleScroll}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {messagesWithTimestamps.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              onRetry={handleMessageRetry}
              canRetry={status !== "streaming"}
            />
          ))}

          {status === "streaming" && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-xs lg:max-w-md">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-center">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
                <div className="flex items-center gap-2 text-destructive">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="font-medium">Error occurred</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">
                  {error.message || "Failed to get response from AI assistant"}
                </p>
              </div>
            </div>
          )}

          {messages.length === 0 && (
            <div className="flex justify-center items-center h-32">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium">Start a conversation</p>
                <p className="text-sm">
                  Ask me anything and I'll help you out!
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {!isAtBottom && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <Button
            onClick={handleJumpToBottom}
            className="flex items-center justify-center"
            title="Jump to bottom"
          >
            <ChevronDown className="h-4 w-4" /> Jump to bottom
          </Button>
        </div>
      )}

      <div className="flex-shrink-0 border-t bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={status === "streaming"}
            status={status}
            error={error}
            onStop={handleStop}
            onRetry={handleGlobalRetry}
          />
        </div>
      </div>
    </div>
  );
}
