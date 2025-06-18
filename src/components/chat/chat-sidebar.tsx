import {
  MessageSquarePlus,
  MessageSquare,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useInfiniteChats } from "@/hooks/use-infinite-chats";
import { DeleteChatDialog } from "@/components/dialogs/delete-chat-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function ChatSidebar() {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = useLocation({ select: l => l.pathname });

  const { allChats, hasNextPage, loadMoreRef, isLoadingMore } =
    useInfiniteChats(20);

  return (
    <TooltipProvider>
      <Sidebar className="border-r bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/60">
        <SidebarHeader className="p-4 pb-3">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-sidebar-foreground leading-tight">
                Usman's Chatbot
              </h2>
            </div>
          </div>
          <Link to="/" onClick={() => isMobile && toggleSidebar()}>
            <Button
              className="w-full h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 rounded-lg font-medium"
              size="default"
            >
              <MessageSquarePlus className="w-4 h-4" />
              Start New Chat
            </Button>
          </Link>
        </SidebarHeader>
        <SidebarContent className="pb-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-2">
              Recent Conversations
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-0.5">
                {allChats.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      isActive={pathname === `/chat/${chat.id}`}
                      asChild
                      className="relative rounded-lg h-10 px-2 transition-all duration-200 hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:shadow-sm data-[active=true]:border-sidebar-accent-foreground/10 border border-transparent mx-1"
                    >
                      <Link to="/chat/$chatId" params={{ chatId: chat.id }}>
                        <div className="flex items-center gap-2.5 w-full min-w-0">
                          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-sidebar-accent/20 transition-colors">
                            <MessageSquare className="w-3.5 h-3.5 text-sidebar-accent-foreground/70" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-sidebar-foreground truncate block leading-tight">
                              {chat.title}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                    <DeleteChatDialog chatId={chat.id} chatTitle={chat.title}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuAction
                            showOnHover
                            className="hover:bg-destructive/10 hover:text-destructive transition-colors h-7 px-2"
                          >
                            <Trash2 />
                          </SidebarMenuAction>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p>Delete chat</p>
                        </TooltipContent>
                      </Tooltip>
                    </DeleteChatDialog>
                  </SidebarMenuItem>
                ))}

                {/* Infinite scroll trigger and loading indicator */}
                {hasNextPage && (
                  <SidebarMenuItem>
                    <div ref={loadMoreRef} className="flex justify-center py-2">
                      {isLoadingMore ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-sidebar-foreground/30 border-t-sidebar-foreground rounded-full animate-spin" />
                          <span className="text-xs text-sidebar-foreground/60">
                            Loading more...
                          </span>
                        </div>
                      ) : (
                        <div className="w-4 h-4" /> // Invisible trigger element
                      )}
                    </div>
                  </SidebarMenuItem>
                )}

                {allChats.length === 0 && (
                  <div className="px-2 py-6 text-center">
                    <MessageSquare className="w-7 h-7 text-sidebar-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-sidebar-foreground/60 mb-1">
                      No conversations yet
                    </p>
                    <p className="text-xs text-sidebar-foreground/40">
                      Start a new chat to get going
                    </p>
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  );
}
