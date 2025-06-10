import { MessageSquarePlus, MessageSquare } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { SidebarChat } from "@/server/chats/getChats";

interface ChatSidebarProps {
  chats: SidebarChat[];
}

export function ChatSidebar({ chats }: ChatSidebarProps) {
  const pathname = useLocation({ select: l => l.pathname });

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link to="/">
          <Button className="w-full" size="sm">
            <MessageSquarePlus className="h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map(chat => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={pathname === `/chat/${chat.id}`}
                    asChild
                  >
                    <Link to="/chat/$chatId" params={{ chatId: chat.id }}>
                      <MessageSquare className="h-4 w-4" />
                      <span className="truncate">{chat.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
