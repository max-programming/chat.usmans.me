import { Skeleton } from "../ui/skeleton";
import { ChatMessagesSkeleton } from "./chat-message-skeleton";
import { MessageCircle, Globe } from "lucide-react";
import { Badge } from "../ui/badge";

export function SharedChatSkeleton() {
  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <div className="flex-shrink-0 flex justify-between items-center p-4 pb-3 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 border-border/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          Public
        </Badge>
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex flex-col h-full bg-background relative">
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
              <ChatMessagesSkeleton />
            </div>
          </div>

          <div className="flex-shrink-0 border-t bg-muted/50">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="text-center text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>
                    This is a read-only shared chat. You cannot send messages.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
