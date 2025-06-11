import { useChatMessages } from "@/hooks/use-chat-messages";
import { ChatInput } from "./chat-input";
import { LogoutButton } from "../LogoutButton";
import { SidebarTrigger } from "../ui/sidebar";

export function ChatHome() {
  const { handleSendMessage, handleStop, status, error } = useChatMessages({});

  return (
    <>
      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-foreground">
            Chat Assistant
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>
      <div className="flex-1 min-h-0">
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
      </div>
    </>
  );
}
