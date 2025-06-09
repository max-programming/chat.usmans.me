import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";

let markdownProcessor: Awaited<
  ReturnType<typeof createMarkdownProcessor>
> | null = null;

async function createMarkdownProcessor() {
  return unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypeShiki, {
      theme: "dark-plus",
    })
    .use(rehypeStringify);
}

async function getMarkdownProcessor() {
  if (!markdownProcessor) {
    markdownProcessor = await createMarkdownProcessor();
  }
  return markdownProcessor;
}

export async function processMarkdown(content: string): Promise<string> {
  try {
    const processor = await getMarkdownProcessor();
    const result = await processor.process(content);
    return String(result);
  } catch (error) {
    console.error("Error processing markdown on server:", error);
    // Return the original content wrapped in a basic paragraph if processing fails
    return `<p>${content}</p>`;
  }
}

export async function processMarkdownMessages<T extends { content: string }>(
  messages: Array<T>
): Promise<Array<T & { processedContent: string }>> {
  const processedMessages = await Promise.all(
    messages.map(async message => ({
      ...message,
      processedContent: await processMarkdown(message.content),
    }))
  );

  return processedMessages;
}
