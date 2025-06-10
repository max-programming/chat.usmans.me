import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { queries } from "@/lib/queries";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_protected")({
  beforeLoad({ context }) {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
  async loader({ context }) {
    const chats = await context.queryClient.ensureQueryData(queries.chats.all);
    return { chats };
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { data: chats } = useSuspenseQuery(queries.chats.all);

  return (
    <div className="h-screen">
      <SidebarProvider>
        <ChatSidebar chats={chats} />
        <SidebarInset className="flex flex-col">
          <main className="flex-1 min-h-0">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
