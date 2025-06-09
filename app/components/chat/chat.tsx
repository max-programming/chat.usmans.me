import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { useChat } from "@ai-sdk/react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export function Chat() {
  const { messages, input, setInput, append, status, error, reload, stop } =
    useChat({
      onResponse: response => {
        console.log("Chat API Response:", response.status, response.statusText);
      },
      onError: error => {
        console.error("Chat Error:", error);
      },
    });

  async function handleSendMessage(content: string) {
    await append({
      role: "user",
      content,
    });
  }

  function handleInputChange(value: string) {
    setInput(value);
  }

  function handleRetry() {
    if (error) {
      reload();
    }
  }

  function handleStop() {
    if (status === "streaming") {
      stop();
    }
  }

  // Convert AI SDK messages to our Message interface with timestamps
  const messagesWithTimestamps: Message[] = messages.map((msg, index) => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as "user" | "assistant",
    timestamp: new Date(Date.now() - (messages.length - index) * 60000),
  }));

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with controls */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-2">
            {/* Retry button - show when there's an error */}
            {error && (
              <button
                onClick={handleRetry}
                className="text-sm px-3 py-1 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              >
                Retry
              </button>
            )}

            {/* Stop button - show when streaming */}
            {status === "streaming" && (
              <button
                onClick={handleStop}
                className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
          {messagesWithTimestamps.map(message => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Loading indicator when streaming */}
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

          {/* Error message */}
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
                <button
                  onClick={handleRetry}
                  className="text-sm text-destructive underline hover:no-underline mt-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
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
        </div>
      </div>

      {/* Status indicator */}
      <div className="flex-shrink-0 px-4 py-1">
        <div className="max-w-4xl mx-auto">
          {status === "streaming" && (
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              AI is thinking...
            </div>
          )}
          {status === "ready" && messages.length > 0 && (
            <div className="text-xs text-muted-foreground">Ready to chat</div>
          )}
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            value={input}
            onChange={handleInputChange}
            onSendMessage={handleSendMessage}
            disabled={status === "streaming"}
            placeholder={
              error
                ? "Fix the error above and try again..."
                : "Type your message here..."
            }
          />
        </div>
      </div>
    </div>
  );
}
