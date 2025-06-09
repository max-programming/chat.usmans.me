import { useState } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "demo-1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: "demo-2",
      content: "Hi there! Can you help me understand how React hooks work?",
      role: "user",
      timestamp: new Date(Date.now() - 280000), // 4 minutes 40 seconds ago
    },
    {
      id: "demo-3",
      content:
        "Absolutely! React hooks are functions that let you use state and other React features in functional components. The most common ones are:\n\n• `useState` - for managing component state\n• `useEffect` - for side effects and lifecycle events\n• `useContext` - for consuming context\n• `useMemo` and `useCallback` - for performance optimization\n\nWould you like me to explain any of these in more detail?",
      role: "assistant",
      timestamp: new Date(Date.now() - 260000), // 4 minutes 20 seconds ago
    },
    {
      id: "demo-4",
      content:
        "That's really helpful! Can you show me a simple useState example?",
      role: "user",
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    },
    {
      id: "demo-5",
      content:
        "Sure! Here's a simple counter example using useState:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```\n\nThe `useState` hook returns an array with two elements: the current state value and a function to update it. You can destructure these into meaningful variable names.",
      role: "assistant",
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    },
    {
      id: "demo-6",
      content:
        "Perfect! This makes so much sense now. Thank you for the clear explanation!",
      role: "user",
      timestamp: new Date(Date.now() - 60000), // 1 minute ago
    },
    {
      id: "demo-7",
      content:
        "You're very welcome! I'm glad I could help clarify React hooks for you. Feel free to ask if you have any more questions about React or anything else!",
      role: "assistant",
      timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (demo)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a demo response to: "${content}". In a real implementation, this would connect to your LLM API.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {messages.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
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
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
