import { Chat } from "@/components/chat/chat";
import { ChatSkeleton } from "@/components/chat/chat-skeleton";
import { queries } from "@/lib/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

interface ChatPageSearch {
  isNew?: boolean;
}

export const Route = createFileRoute("/_protected/chat/$chatId")({
  component: ChatInterface,
  validateSearch: (search): ChatPageSearch => ({
    isNew: search.isNew === true ? true : undefined,
  }),
  loaderDeps: ({ search }) => ({
    isNew: search.isNew,
  }),
  loader: ({ context, params, deps }) => {
    const { chatId } = params;
    const { isNew } = deps;
    // if (isNew) {
    //   context.queryClient.setQueryData(
    //     queries.chats.withMessages(chatId).queryKey,
    //     {
    //       chat: {
    //         id: chatId,
    //         title: "New Chat",
    //       },
    //       messages: [],
    //     }
    //   );
    //   return;
    // }

    context.queryClient.ensureQueryData(
      queries.chats.withMessages(chatId, isNew)
    );
  },
  head() {
    return {
      meta: [
        {
          title: `New Chat | Chat Assistant`,
        },
      ],
    };
  },
});

function ChatInterface() {
  const { chatId } = Route.useParams();

  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <Suspense fallback={<ChatSkeleton />}>
        <Chat chatId={chatId} />
      </Suspense>
    </div>
  );
}
