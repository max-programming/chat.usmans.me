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
        pathname.startsWith("/share/") ? "bottom-12" : "bottom-40"
      )}
    >
      <Button
        onClick={onClick}
        className="flex items-center justify-center"
        title="Jump to bottom"
      >
        <ChevronDown className="h-4 w-4" /> Jump to bottom
      </Button>
    </div>
  );
}
