import { SharedChat } from "@/components/chat/shared-chat";
import { SharedChatSkeleton } from "@/components/chat/shared-chat-skeleton";
import { queries } from "@/lib/queries";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/share/$shareId")({
  component: SharedChatInterface,
  loader: ({ context, params }) => {
    const { shareId } = params;

    // Prefetch the public chat data
    context.queryClient.ensureQueryData(
      queries.chats.publicWithMessages(shareId)
    );
  },
  head: ({ params }) => {
    return {
      meta: [
        {
          title: `Shared Chat | Usman's Chatbot`,
        },
        {
          name: "description",
          content: "View a publicly shared AI conversation",
        },
      ],
    };
  },
});

function SharedChatInterface() {
  const { shareId } = Route.useParams();

  return (
    <div className="h-screen w-full flex flex-col max-h-screen overflow-hidden">
      <Suspense fallback={<SharedChatSkeleton />}>
        <SharedChat shareId={shareId} />
      </Suspense>
    </div>
  );
}
