import { ChatWelcome } from "@/components/chat-welcome";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: ChatInterface,
});

function ChatInterface() {
  const { user } = Route.useRouteContext();

  return (
    <div className="h-full flex flex-col">
      <ChatWelcome user={user!} />
    </div>
  );
}
