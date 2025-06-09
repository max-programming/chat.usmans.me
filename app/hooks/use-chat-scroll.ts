import { useEffect, useRef, useState } from "react";

export function useChatScroll() {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  function scrollToBottom(smooth = true) {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "end",
    });
  }

  function checkIfAtBottom() {
    if (!scrollAreaRef.current) return false;

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
    const threshold = 100;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }

  function handleScroll() {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);

    if (!atBottom) {
      setShouldAutoScroll(false);
    }
  }

  function jumpToBottom() {
    setShouldAutoScroll(true);
    scrollToBottom();
  }

  function enableAutoScroll() {
    setShouldAutoScroll(true);
  }

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [shouldAutoScroll]);

  useEffect(() => {
    if (isAtBottom) {
      setShouldAutoScroll(true);
    }
  }, [isAtBottom]);

  return {
    isAtBottom,
    shouldAutoScroll,
    messagesEndRef,
    scrollAreaRef,
    handleScroll,
    jumpToBottom,
    enableAutoScroll,
    scrollToBottom,
  };
}
