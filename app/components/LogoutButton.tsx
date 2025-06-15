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
      className="flex items-center gap-2 h-8 px-3 sm:h-8 sm:px-3 rounded-lg border-border/50 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <LogOut className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
      <span className="font-medium text-xs sm:text-sm hidden sm:inline">
        Logout
      </span>
    </Button>
  );
}
