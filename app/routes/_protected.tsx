import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatSidebarSkeleton } from "@/components/chat/chat-sidebar-skeleton";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { queries } from "@/lib/queries";
import { Suspense } from "react";

export const Route = createFileRoute("/_protected")({
  beforeLoad({ context }) {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
  loader({ context }) {
    context.queryClient.ensureQueryData(queries.chats.all);
  },
  component: ProtectedLayout,
});

function ProtectedLayout() {
  return (
    <div className="h-screen">
      <SidebarProvider>
        <Suspense fallback={<ChatSidebarSkeleton />}>
          <ChatSidebar />
        </Suspense>
        <SidebarInset className="flex flex-col">
          <main className="flex-1 min-h-0">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
