import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { ChatSidebar } from "@/components/chat-sidebar";

export const Route = createFileRoute("/_protected")({
  beforeLoad({ context }) {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { user } = Route.useRouteContext();

  return (
    <div className="h-screen flex max-h-screen overflow-hidden">
      <ChatSidebar user={user!} />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
