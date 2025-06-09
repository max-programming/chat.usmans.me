import { useMemo, useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

export function Markdown({ content, className }: MarkdownProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processor = useMemo(() => {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: false })
      .use(rehypeShiki, {
        theme: "dark-plus",
      })
      .use(rehypeStringify);
  }, []);

  useEffect(() => {
    async function processMarkdown() {
      if (!content.trim()) {
        setHtmlContent("");
        return;
      }

      setIsProcessing(true);
      try {
        const result = await processor.process(content);
        setHtmlContent(String(result));
      } catch (error) {
        console.error("Error processing markdown:", error);
        setHtmlContent(content);
      } finally {
        setIsProcessing(false);
      }
    }

    processMarkdown();
  }, [processor, content]);

  if (isProcessing) {
    return (
      <div
        className={cn(
          "prose prose-sm dark:prose-invert max-w-none",
          "prose-p:leading-relaxed",
          className
        )}
      >
        <p className="text-muted-foreground">Processing markdown...</p>
      </div>
    );
  }

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
