import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useDeleteChat } from "@/lib/mutations/use-delete-chat";

interface DeleteChatDialogProps {
  children: React.ReactNode;
  chatId: string;
  chatTitle: string;
}

export function DeleteChatDialog({
  children,
  chatId,
  chatTitle,
}: DeleteChatDialogProps) {
  const deleteChat = useDeleteChat();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Delete Chat
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{chatTitle}"? This action is
            irreversible and will permanently delete the chat and all its
            messages forever.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => deleteChat.mutate({ chatId })}
            disabled={deleteChat.isPending}
          >
            {deleteChat.isPending ? "Deleting..." : "Delete Chat"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
