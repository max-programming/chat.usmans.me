import { Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { ShareDialog } from "./dialogs/share-dialog";

export function ShareButton({ chatId }: { chatId: string }) {
  return (
    <ShareDialog chatId={chatId}>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-8 px-3 rounded-lg border-border/50 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200 shadow-sm hover:shadow-md"
      >
        <Share2 className="w-3.5 h-3.5" />
        <span className="font-medium text-sm">Share</span>
      </Button>
    </ShareDialog>
  );
}
