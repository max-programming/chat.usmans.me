import { ChatHome } from "@/components/chat/chat-home";
import { LogoutButton } from "@/components/LogoutButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: ChatInterface,
  loader: async ({ context }) => {
    return {
      user: context.user!,
      messages: [],
    };
  },
  head() {
    return {
      meta: [
        {
          title: "Chat Assistant",
        },
      ],
    };
  },
});

function ChatInterface() {
  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <ChatHome />
    </div>
  );
}
