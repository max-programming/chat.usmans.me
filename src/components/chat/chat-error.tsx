import { AlertCircle } from "lucide-react";

interface ChatErrorProps {
  error: Error;
}

export function ChatError({ error }: ChatErrorProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="font-medium">Error occurred</span>
        </div>
        <p className="text-sm text-destructive/80 mt-1">
          {error.message || "Failed to get response from AI assistant"}
        </p>
      </div>
    </div>
  );
}
