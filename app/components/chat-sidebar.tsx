import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  MessageSquarePlus,
  MessageSquare,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/LogoutButton";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  user: {
    email: string;
    name?: string;
    avatar_url?: string;
  };
}

export function ChatSidebar({ user }: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const dummyChats = [
    { id: "1", title: "React Hooks Tutorial", lastMessage: "2 hours ago" },
    { id: "2", title: "JavaScript Fundamentals", lastMessage: "1 day ago" },
    { id: "3", title: "TypeScript Best Practices", lastMessage: "3 days ago" },
    { id: "4", title: "CSS Grid Layout", lastMessage: "1 week ago" },
    { id: "5", title: "Node.js API Development", lastMessage: "2 weeks ago" },
  ];

  return (
    <div
      className={`${
        isOpen ? "w-80" : "w-16"
      } transition-all duration-300 ease-in-out bg-card border-r border-border h-full flex flex-col`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {isOpen && (
          <h2 className="text-lg font-semibold text-foreground">Chats</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8"
        >
          {isOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          asChild
          size={isOpen ? "lg" : "icon"}
          className={cn("w-full", isOpen && "justify-start")}
          variant="default"
        >
          <Link to="/">
            <MessageSquarePlus className="h-4 w-4" />
            {isOpen && <span className="ml-2">New Chat</span>}
          </Link>
        </Button>
      </div>

      {isOpen && (
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Recent chats
            </h3>
            <div className="space-y-1">
              {dummyChats.map(chat => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start h-auto p-3 text-left"
                  asChild
                >
                  <Link to="/">
                    <div className="flex items-start space-x-3 w-full">
                      <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {chat.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-auto p-2">
              <div className="flex items-center space-x-3 w-full">
                <User className="h-8 w-8" />
                {isOpen && (
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium truncate">
                      {user.name || user.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0"
            side="top"
            align={isOpen ? "start" : "center"}
          >
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <User className="h-12 w-12" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {user.name || user.email.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <Separator className="my-4" />
              <LogoutButton />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
