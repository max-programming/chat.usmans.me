import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { queries } from "@/lib/queries";
import camelCaseKeys from "camelcase-keys";
import type { ChatWithMessages } from "@/server/chats/getChatWithMessages";
import type { MessageSelect } from "@/lib/db/schema";
import { useEffect } from "react";

const supabase = createClient();

export function useSubscribeMessages(chatId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const messageInsertSub = supabase
      .channel(`messages:chat_id=eq.${chatId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        payload => {
          const newMessage = camelCaseKeys(payload.new) as MessageSelect;
          if (newMessage.chatId !== chatId) return;
          newMessage.createdAt = new Date(newMessage.createdAt);
          const currentData = queryClient.getQueryData<ChatWithMessages>(
            queries.chats.withMessages(chatId).queryKey
          );
          if (
            currentData?.messages.find(message => message.id === newMessage.id)
          ) {
            console.log("Message already exists");
            return;
          }
          queryClient.setQueryData(
            queries.chats.withMessages(chatId).queryKey,
            (old: ChatWithMessages): ChatWithMessages => {
              if (!old) return old;
              return {
                ...old,
                messages: [...old.messages, newMessage],
              };
            }
          );
        }
      )
      .subscribe();

    return () => {
      messageInsertSub.unsubscribe();
    };
  }, [chatId, queryClient]);
}
