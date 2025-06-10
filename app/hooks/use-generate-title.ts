import { useUpdateChatTitle } from "@/lib/mutations/use-update-chat-title";
import { useCompletion } from "@ai-sdk/react";

export function useGenerateTitle(chatId: string) {
  const { mutate: updateChatTitle } = useUpdateChatTitle();

  return useCompletion({
    api: "/api/generate-title",
    onFinish(prompt, completion) {
      console.log("onFinish", prompt, completion);
      updateChatTitle({
        chatId,
        title: completion,
      });
    },
  });
}
