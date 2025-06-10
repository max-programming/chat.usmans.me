import { Store } from "@tanstack/react-store";

export const chatStore = new Store({
  chatId: "",
  initialMessage: "",
  isNew: false,
});

export function startNewChat(message: string) {
  const chatId = crypto.randomUUID();
  chatStore.setState({
    chatId,
    initialMessage: message,
    isNew: true,
  });
  return chatId;
}

export function resetChat() {
  chatStore.setState({
    chatId: "",
    initialMessage: "",
    isNew: false,
  });
}
