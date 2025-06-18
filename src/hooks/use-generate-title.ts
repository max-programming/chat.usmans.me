import { useUpdateChatTitle } from "@/lib/mutations/use-update-chat-title";
import { useCompletion } from "@ai-sdk/react";
import { useNavigate } from "@tanstack/react-router";

export function useGenerateTitle(chatId: string) {
  const navigate = useNavigate();
  const { mutate: updateChatTitle } = useUpdateChatTitle();

  return useCompletion({
    api: "/api/generate-title",
    initialCompletion: "New Chat",
    onFinish(_, completion) {
      updateChatTitle({
        chatId,
        title: completion,
      });
      navigate({
        to: "/chat/$chatId",
        params: { chatId },
        search: { isNew: undefined },
        replace: true,
      });
    },
  });
}
