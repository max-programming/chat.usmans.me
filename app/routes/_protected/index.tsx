import { LogoutButton } from "@/components/LogoutButton";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: Info,
  loader: async ({ context }) => {
    return {
      user: context.user!,
    };
  },
});

function Info() {
  const data = Route.useLoaderData();

  return (
    <div>
      <p>Hello {data.user.email}</p>
      <LogoutButton />
    </div>
  );
}
