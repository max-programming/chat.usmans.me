import { Skeleton } from "../ui/skeleton";
import { ChatMessagesSkeleton } from "./chat-message-skeleton";
import { ChatInput } from "./chat-input";
import { SidebarTrigger } from "../ui/sidebar";
import { LogOut, MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

export function ChatSkeleton() {
  return (
    <>
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center p-2 pb-2 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 border-border/50 sm:p-4 sm:pb-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <SidebarTrigger className="-ml-1 hover:bg-accent/50 rounded-lg transition-colors" />
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
            <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 sm:h-5 w-32 sm:w-40 mb-1" />
              <Skeleton className="h-3 w-24 sm:w-28" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            disabled
            className="flex items-center gap-2 h-8 px-3 sm:h-8 sm:px-3 rounded-lg border-border/50 shadow-sm"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5 opacity-50" />
            <span className="opacity-50 font-medium text-xs sm:text-sm hidden sm:inline">
              Logout
            </span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full bg-background relative">
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="max-w-4xl mx-auto px-3 py-3 space-y-4 sm:px-4 sm:py-4">
              <ChatMessagesSkeleton />
            </div>
          </div>

          {/* Input Footer */}
          <div className="flex-shrink-0 border-t bg-background">
            <div className="max-w-4xl mx-auto px-3 py-3 sm:px-4 sm:py-4">
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
