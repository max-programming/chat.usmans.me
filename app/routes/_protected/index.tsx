import { Chat } from "@/components/chat/chat";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: ChatInterface,
  loader: async ({ context }) => {
    // Example: Fetch messages from your database
    // const rawMessages = await fetchMessagesFromDatabase(context.user.id);

    // For demo purposes, using the same messages as in the hook
    const rawMessages = [
      {
        id: "demo-2",
        content: "Hi there! Can you help me understand how React hooks work?",
        role: "user" as const,
        timestamp: new Date(Date.now() - 4 * 60000),
      },
      {
        id: "demo-3",
        content:
          "Absolutely! React hooks are functions that let you use state and other React features in functional components. The most common ones are:\n\n• `useState` - for managing component state\n• `useEffect` - for side effects and lifecycle events\n• `useContext` - for consuming context\n• `useMemo` and `useCallback` - for performance optimization\n\nWould you like me to explain any of these in more detail?",
        role: "assistant" as const,
        timestamp: new Date(Date.now() - 3 * 60000),
      },
      {
        id: "demo-4",
        content:
          "That's really helpful! Can you show me a simple useState example?",
        role: "user" as const,
        timestamp: new Date(Date.now() - 2 * 60000),
      },
      {
        id: "demo-5",
        content:
          "Sure! Here's a simple counter example using useState:\n\n```jsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>\n        Increment\n      </button>\n    </div>\n  );\n}\n```\n\nThe `useState` hook returns an array with two elements: the current state value and a function to update it. You can destructure these into meaningful variable names.",
        role: "assistant" as const,
        timestamp: new Date(Date.now() - 1 * 60000),
      },
    ];

    return {
      user: context.user!,
      messages: rawMessages,
    };
  },
});

function ChatInterface() {
  const data = Route.useLoaderData();

  return (
    <div className="h-full flex flex-col">
      <Chat initialMessages={data.messages} />
    </div>
  );
}
