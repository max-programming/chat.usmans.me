import { LogoutButton } from "../LogoutButton";
import { SidebarTrigger } from "../ui/sidebar";

interface ChatHeaderProps {
  title: string;
}

export function ChatHeader({ title }: ChatHeaderProps) {
  return (
    <div className="flex-shrink-0 flex justify-between items-center p-4 border-b bg-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <LogoutButton />
      </div>
    </div>
  );
}
