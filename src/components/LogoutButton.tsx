import { Button } from "@/components/ui/button";
import { logoutUser } from "@/server/logoutUser";
import { useNavigate } from "@tanstack/react-router";
import { LogOut, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function LogoutButton() {
  const navigate = useNavigate();

  async function handleLogout() {
    await logoutUser();
    navigate({ to: "/login" });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 h-8 px-3 sm:h-8 sm:px-3 rounded-lg border-border/50 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <LogOut className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5" />
          <span className="font-medium text-xs sm:text-sm hidden sm:inline">
            Logout
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to logout? You will need to sign in again to
            access your chats.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleLogout}
          >
            Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
