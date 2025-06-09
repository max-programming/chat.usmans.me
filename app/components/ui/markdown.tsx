import { useMemo } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const processor = useMemo(() => {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeHighlight)
      .use(rehypeStringify);
  }, []);

  const htmlContent = useMemo(() => {
    try {
      const result = processor.processSync(content);
      return String(result);
    } catch (error) {
      console.error("Error processing markdown:", error);
      return content;
    }
  }, [processor, content]);

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
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
