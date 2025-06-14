import { MessageSquarePlus, MessageSquare, Sparkles } from "lucide-react";
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
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ChatSidebarSkeleton() {
  return (
    <Sidebar className="border-r bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
      <SidebarHeader className="p-4 pb-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-sidebar-foreground leading-tight">
              Chat Assistant
            </h2>
            <p className="text-xs text-sidebar-foreground/60">Powered by AI</p>
          </div>
        </div>
        <Button
          className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 rounded-lg font-medium"
          size="default"
          disabled
        >
          <MessageSquarePlus className="w-4 h-4 mr-2" />
          Start New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent className="px-2 pb-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
            Recent Conversations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {Array.from({ length: 6 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    disabled
                    className="group relative rounded-lg h-10 px-2 transition-all duration-200 mx-1"
                  >
                    <div className="flex items-center gap-2.5 w-full min-w-0">
                      <div className="flex items-center justify-center w-6 h-6 rounded-md bg-sidebar-accent/20">
                        <MessageSquare className="w-3.5 h-3.5 text-sidebar-accent-foreground/30" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <Skeleton className="h-3.5 w-full max-w-[120px]" />
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
