import { useState, useEffect } from "react";
import { Markdown } from "./markdown";
import { ProcessedMarkdown } from "./processed-markdown";
import { cn } from "@/lib/utils";

interface StreamingMarkdownProps {
  content: string;
  isStreaming?: boolean;
  processedContent?: string;
  className?: string;
}

export function StreamingMarkdown({
  content,
  isStreaming = false,
  processedContent,
  className,
}: StreamingMarkdownProps) {
  const [delayedContent, setDelayedContent] = useState(content);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update content immediately during streaming for real-time effect
  useEffect(() => {
    if (isStreaming) {
      setDelayedContent(content);
    }
  }, [content, isStreaming]);

  // Process markdown only when streaming stops
  useEffect(() => {
    if (!isStreaming && content !== delayedContent) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setDelayedContent(content);
        setIsProcessing(false);
      }, 100); // Small delay to avoid jarring transitions

      return () => clearTimeout(timer);
    }
  }, [isStreaming, content, delayedContent]);

  // If we have pre-processed content, use it
  if (processedContent && !isStreaming) {
    return <ProcessedMarkdown html={processedContent} className={className} />;
  }

  // During streaming: show raw text with basic formatting
  if (isStreaming) {
    return (
      <div
        className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
          <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
        </div>
      </div>
    );
  }

  // After streaming: show processed markdown with loading state
  if (isProcessing) {
    return (
      <div
        className={cn("prose prose-sm dark:prose-invert max-w-none", className)}
      >
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed opacity-50">
          {delayedContent}
        </pre>
        <div className="text-xs text-muted-foreground mt-1">
          Processing markdown...
        </div>
      </div>
    );
  }

  // Final state: full markdown processing
  return <Markdown content={delayedContent} className={className} />;
}
