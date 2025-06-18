import { Link } from "@tanstack/react-router";
import { MessageCircle, AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "./ui/button";

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="h-screen flex flex-col max-h-screen overflow-hidden">
      <div className="flex-shrink-0 flex justify-center items-center p-4 pb-3 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted border border-border">
            <MessageCircle className="w-4 h-4 text-muted-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">
            Page Not Found
          </h1>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted/50 mx-auto mb-6">
            <AlertTriangle className="w-10 h-10 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-3">
            404 - Page Not Found
          </h2>

          <div className="text-muted-foreground mb-6 leading-relaxed">
            {children || <p>The page you are looking for does not exist.</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>

            <Button asChild className="flex items-center gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            If you believe this is an error, please check the URL or try
            refreshing the page.
          </p>
        </div>
      </div>
    </div>
  );
}
