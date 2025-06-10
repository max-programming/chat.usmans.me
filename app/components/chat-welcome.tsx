import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, BookOpen, Code2, Send } from "lucide-react";

interface ChatWelcomeProps {
  user: {
    email: string;
    name?: string;
  };
}

export function ChatWelcome({ user }: ChatWelcomeProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log("Message:", message);
  };

  const quickActions = [
    { label: "Write", icon: PenTool },
    { label: "Learn", icon: BookOpen },
    { label: "Code", icon: Code2 },
  ];

  const userName = user.name || user.email.split("@")[0];

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-medium text-foreground mb-2">
            Heya {userName}!
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="relative">
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Ask me anything as I'm a friend"
              className="min-h-[120px] resize-none border-border bg-card md:text-lg pr-14"
            />

            <div className="absolute bottom-3 right-3">
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8"
                disabled={!message.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Input actions */}
            {/* <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                <Wand2 className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-xs">
                <span>Claude Sonnet 4</span>
                <ChevronUp className="h-3 w-3" />
              </div>
            </div> */}
          </div>
        </form>

        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          {quickActions.map(action => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-sm"
                onClick={() => {
                  // TODO: Handle quick action
                  console.log("Quick action:", action.label);
                }}
              >
                <Icon />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
