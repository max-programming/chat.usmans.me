import { useUpdateChatTitle } from "@/lib/mutations/use-update-chat-title";
import { useCompletion } from "@ai-sdk/react";

export function useGenerateTitle(chatId: string) {
  const { mutate: updateChatTitle } = useUpdateChatTitle();

  return useCompletion({
    api: "/api/generate-title",
    initialCompletion: "New Chat",
    onFinish(_, completion) {
      updateChatTitle({
        chatId,
        title: completion,
      });
    },
  });
}
