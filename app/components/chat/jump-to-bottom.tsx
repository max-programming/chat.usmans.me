import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JumpToBottomProps {
  onClick: () => void;
}

export function JumpToBottom({ onClick }: JumpToBottomProps) {
  return (
    <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-10">
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
