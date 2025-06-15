import { LogoutButton } from "../LogoutButton";
import { SidebarTrigger } from "../ui/sidebar";
import { MessageCircle } from "lucide-react";
import { ShareButton } from "../ShareButton";

interface ChatHeaderProps {
  title: string;
  chatId?: string;
}

export function ChatHeader({ title, chatId }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 flex justify-between items-center p-2 pb-2 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 border-border/50 sm:p-4 sm:pb-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1 hover:bg-accent/50 rounded-lg transition-colors" />
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-lg font-semibold text-foreground leading-tight truncate">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">AI Conversation</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <LogoutButton />
        {chatId && <ShareButton chatId={chatId} />}
      </div>
    </div>
  );
}
