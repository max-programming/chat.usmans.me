import { Button } from "@/components/ui/button";
import { logoutUser } from "@/server/logoutUser";
import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const navigate = useNavigate();
  async function handleLogout() {
    await logoutUser();
    navigate({ to: "/login" });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </Button>
  );
}
