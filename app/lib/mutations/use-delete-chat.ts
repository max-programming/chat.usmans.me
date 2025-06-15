import { deleteChat, type DeleteChatInput } from "@/server/chats/deleteChat";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { queries } from "../queries";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import type { InfiniteChats } from "@/server/chats/getChatsInfinite";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useDeleteChat() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useLocation({ select: l => l.pathname });

  return useMutation({
    mutationFn: (input: DeleteChatInput) => deleteChat({ data: input }),
    onMutate(input) {
      toast.loading("Deleting chat...");
      queryClient.setQueryData<InfiniteData<InfiniteChats>>(
        queries.chats.infinite(20).queryKey,
        old => {
          if (!old || !old.pages || old.pages.length === 0) return old;
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                chats: old.pages[0].chats.filter(
                  chat => chat.id !== input.chatId
                ),
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );
      queryClient.setQueryData(
        queries.chats.withMessages(input.chatId).queryKey,
        (old: ChatWithMessages) => ({ ...old, messages: [] })
      );
      if (pathname === `/chat/${input.chatId}`) {
        navigate({ to: "/", replace: true });
      }
    },
    onError(error, variables) {
      console.error("Error deleting chat", error);
      toast.dismiss();
      toast.error("Failed to delete chat");
      queryClient.invalidateQueries({
        queryKey: queries.chats.withMessages(variables.chatId).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: queries.chats.infinite(20).queryKey,
      });
      if (pathname !== `/chat/${variables.chatId}`) {
        navigate({ to: `/chat/${variables.chatId}`, replace: true });
      }
    },
    onSuccess() {
      toast.dismiss();
      toast.success("Chat deleted successfully");
    },
  });
}
