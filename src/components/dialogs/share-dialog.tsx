import { useState } from "react";
import { Copy, Check, Lock, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import { useToggleChatPublic } from "@/hooks/use-toggle-chat-public";

interface ShareDialogProps {
  children: React.ReactNode;
  chatId: string;
}

export function ShareDialog({ children, chatId }: ShareDialogProps) {
  const queryClient = useQueryClient();
  const toggleChatPublic = useToggleChatPublic();
  const [copied, setCopied] = useState(false);

  const result = queryClient.getQueryData<ChatWithMessages>(
    queries.chats.withMessages(chatId).queryKey
  );
  const sharingEnabled = result?.chat.isPublic ?? false;
  const shareId = result?.chat.shareId ?? null;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/share/${shareId}`;

  async function copyToClipboard() {
    if (!sharingEnabled) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {sharingEnabled ? (
              <Globe className="w-5 h-5 text-primary animate-in -spin-in-180 duration-700 transition-all ease-in-out" />
            ) : (
              <Lock className="w-5 h-5 text-muted-foreground" />
            )}
            Share Chat
          </DialogTitle>
          <DialogDescription>
            {sharingEnabled
              ? "Anyone with this link can view this chat conversation."
              : "This chat is currently private. Enable sharing to create a public link."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mt-4">
          <Label
            htmlFor="enable-sharing"
            className="text-sm font-medium leading-none cursor-pointer"
          >
            Enable public sharing
          </Label>
          <Switch
            id="enable-sharing"
            checked={sharingEnabled}
            onCheckedChange={() => toggleChatPublic.mutate()}
          />
        </div>

        <div className="mt-4 min-h-[2.5rem]">
          {sharingEnabled ? (
            <div className="flex items-center space-x-2 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="grid flex-1 gap-2">
                <Input
                  readOnly
                  value={shareUrl}
                  className="font-mono text-sm"
                />
              </div>
              <Button
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-10 text-xs text-muted-foreground animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3" />
                <span>
                  Your chat is private. Only you can see this conversation.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 min-h-[4rem]">
          {sharingEnabled ? (
            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <strong>Note:</strong> This link makes your chat publicly
              accessible. Anyone with the link can view the entire conversation.
            </div>
          ) : (
            <div className="text-xs text-muted-foreground p-3 bg-muted/30 rounded-md border border-border/50 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <div className="flex items-start gap-2">
                <Lock className="w-3 h-3 mt-0.5 shrink-0" />
                <span>
                  Turn on sharing to create a public link that others can use to
                  view this conversation.
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
