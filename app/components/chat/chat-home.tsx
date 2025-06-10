import { useChatMessages } from "@/hooks/use-chat-messages";
import { ChatInput } from "./chat-input";

export function ChatHome() {
  const { handleSendMessage, handleStop, status, error } = useChatMessages({});

  return (
    <div className="flex h-full bg-background items-center justify-center">
      <div className="max-w-4xl w-full px-4 py-4">
        <ChatInput
          onSendMessage={content => handleSendMessage(content)}
          status={status}
          error={error}
          onStop={handleStop}
        />
      </div>
    </div>
  );
}
