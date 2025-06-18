import type { ReactNode } from "react";
import ShikiHighlighter, { isInlineCode, type Element } from "react-shiki";
import { Button } from "./button";
import { Copy } from "lucide-react";

interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

export function CodeHighlight({
  className,
  children,
  node,
  ...props
}: CodeHighlightProps) {
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;
  const code = String(children).trim();

  const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;

  return !isInline ? (
    <div className="relative">
      <div className="bg-muted/50 px-2 py-1 rounded-t-md flex items-center justify-between absolute top-0 w-full z-10">
        <div className="pl-3">{language}</div>
        <div>
          <Button variant="ghost" className="size-7">
            <Copy />
          </Button>
        </div>
      </div>
      <ShikiHighlighter
        language={language}
        theme="vesper"
        delay={150}
        // showLineNumbers
        showLanguage={false}
        defaultColor="dark"
        {...props}
      >
        {code}
      </ShikiHighlighter>
    </div>
  ) : (
    <code className={className}>{code}</code>
  );
}
