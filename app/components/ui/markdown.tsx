import { memo } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { CodeHighlight } from "./code-highlight";

interface MarkdownProps {
  content: string;
  className?: string;
}

export const Markdown = memo<MarkdownProps>(({ content, className }) => {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        "prose-pre:p-0",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:bg-muted/50 prose-blockquote:pl-4",
        "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm",
        "prose-p:leading-relaxed prose-li:leading-relaxed",
        className
      )}
    >
      <ReactMarkdown components={{ code: CodeHighlight }}>
        {content}
      </ReactMarkdown>
    </div>
  );
});
