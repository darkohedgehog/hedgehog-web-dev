import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-sky-300 prose-a:underline-offset-4 hover:prose-a:underline prose-code:text-sky-200 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children, ...props }) => {
            const isExternal = typeof href === "string" && /^https?:\/\//.test(href);

            return (
              <a
                href={href}
                {...props}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {children}
                {isExternal ? " ↗" : null}
              </a>
            );
          },
          code: ({ className, children, ...props }) => {
            // inline code (bez ``` blokova) dobija <code> bez className
            const isBlock = Boolean(className);
            if (!isBlock) {
              return (
                <code
                  className="rounded-md bg-white/10 px-1 py-0.5 text-[0.9em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}