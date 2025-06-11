import { Skeleton } from "../ui/skeleton";
import { ChatMessagesSkeleton } from "./chat-message-skeleton";
import { ChatInput } from "./chat-input";
import { SidebarTrigger } from "../ui/sidebar";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function ChatSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <LogOut className="h-4 w-4 opacity-50" />
            <span className="opacity-50">Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full bg-background relative">
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
              <ChatMessagesSkeleton />
            </div>
          </div>

          {/* Input Footer */}
          <div className="flex-shrink-0 border-t bg-background">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <ChatInput
                onSendMessage={() => {}}
                disabled={true}
                status="ready"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
