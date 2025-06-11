import { MessageSquarePlus, MessageSquare } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

export function ChatSidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Button className="w-full" size="sm" disabled>
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {Array.from({ length: 8 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton disabled>
                    <MessageSquare className="h-4 w-4 opacity-50" />
                    <Skeleton className="h-4 flex-1" />
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
