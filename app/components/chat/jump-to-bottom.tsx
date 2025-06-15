import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

interface JumpToBottomProps {
  onClick: () => void;
}

export function JumpToBottom({ onClick }: JumpToBottomProps) {
  const pathname = useLocation({ select: l => l.pathname });

  return (
    <div
      className={cn(
        "absolute left-1/2 transform -translate-x-1/2 z-10",
        pathname.startsWith("/share/")
          ? "bottom-8 sm:bottom-12"
          : "bottom-24 sm:bottom-40"
      )}
    >
      <Button
        onClick={onClick}
        size="sm"
        className="flex items-center justify-center gap-1 shadow-lg h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm"
        title="Jump to bottom"
      >
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
        <span className="hidden sm:inline">Jump to bottom</span>
        <span className="sm:hidden">Bottom</span>
      </Button>
    </div>
  );
}
