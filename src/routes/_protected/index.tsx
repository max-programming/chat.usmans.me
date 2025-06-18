import { ChatHome } from "@/components/chat/chat-home";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

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
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  useEffect(() => {
    if ("code" in search) {
      navigate({ to: "/", replace: true });
    }
  }, []);
  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <ChatHome />
    </div>
  );
}
