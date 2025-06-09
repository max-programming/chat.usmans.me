import { LogoutButton } from "@/components/LogoutButton";
import { Chat } from "@/components/chat/chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: ChatInterface,
  loader: async ({ context }) => {
    return {
      user: context.user!,
    };
  },
});

function ChatInterface() {
  const data = Route.useLoaderData();

  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <div className="flex-shrink-0 flex justify-between items-center p-4 border-b bg-card">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-foreground">
            Chat Assistant
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome, {data.user.email}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LogoutButton />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Chat />
      </div>
    </div>
  );
}
