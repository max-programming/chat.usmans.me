import { cn } from "@/lib/utils";

interface ProcessedMarkdownProps {
  html: string;
  className?: string;
}

export function ProcessedMarkdown({ html, className }: ProcessedMarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        "prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
        "prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:bg-muted/50 prose-blockquote:pl-4",
        "prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-sm",
        "prose-p:leading-relaxed prose-li:leading-relaxed",
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
