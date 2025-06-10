import { Chat } from "@/components/chat/chat";
import { LogoutButton } from "@/components/LogoutButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGenerateTitle } from "@/hooks/use-generate-title";
import { useSingleEffect } from "@/hooks/use-single-effect";
import { queries } from "@/lib/queries";
import { chatStore, resetChat } from "@/lib/stores/chat.store";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";

export const Route = createFileRoute("/_protected/chat/$chatId")({
  component: ChatInterface,
  loader: async ({ context, params }) => {
    const { chatId } = params;
    const { chat, messages } = await context.queryClient.ensureQueryData(
      queries.chats.withMessages(chatId)
    );
    return {
      user: context.user!,
      chat,
      messages,
    };
  },
  head({ loaderData }) {
    return {
      meta: [
        {
          title: `${loaderData?.chat.title ?? "New Chat"} | Chat Assistant`,
        },
      ],
    };
  },
});

function ChatInterface() {
  const { chatId } = Route.useParams();
  const {
    data: { chat, messages },
  } = useSuspenseQuery(queries.chats.withMessages(chatId));
  const { complete, completion } = useGenerateTitle(chatId);
  const { initialMessage, isNew } = useStore(chatStore);

  useSingleEffect(() => {
    if (!isNew) return;
    if (initialMessage.trim() === "") return;
    complete(initialMessage);
  });

  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-foreground">
            {isNew ? completion : chat.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Chat initialMessages={messages} chatId={isNew ? chatId : chat.id} />
      </div>
    </div>
  );
}
