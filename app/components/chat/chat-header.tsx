import { LogoutButton } from "../LogoutButton";
import { SidebarTrigger } from "../ui/sidebar";
import { MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 flex justify-between items-center p-4 pb-3 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 border-border/50">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 hover:bg-accent/50 rounded-lg transition-colors" />
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/20">
            <MessageCircle className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-xs text-muted-foreground">AI Conversation</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LogoutButton />
      </div>
    </div>
  );
}
