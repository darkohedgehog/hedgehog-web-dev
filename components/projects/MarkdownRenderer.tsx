// components/projects/MarkdownRenderer.tsx
import React from "react";
import type { ReactElement, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { createHash } from "crypto";

type Props = {
  content: string;
};

type CodeElProps = {
  className?: string;
  children?: ReactNode;
};

type CalloutKind = "tip" | "note" | "warning" | "info";

const COPY_SCRIPT = `
(function(){
  if (window.__mdCopyBound) return;
  window.__mdCopyBound = true;

  function b64ToUtf8(b64){
    try { return decodeURIComponent(escape(atob(b64))); }
    catch(e){ try { return atob(b64); } catch(_) { return ""; } }
  }

  document.addEventListener('click', async function(e){
    var btn = e.target && e.target.closest ? e.target.closest('[data-md-copy]') : null;
    if (!btn) return;

    var b64 = btn.getAttribute('data-code-b64') || "";
    var code = b64ToUtf8(b64);
    if (!code) return;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        var ta = document.createElement('textarea');
        ta.value = code;
        ta.setAttribute('readonly','');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      var old = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.classList.add('opacity-100');
      setTimeout(function(){
        btn.textContent = old || 'Copy';
      }, 1200);
    } catch(err) {}
  }, { passive: true });
})();
`;

function isExternalHref(href?: string): boolean {
  return typeof href === "string" && /^https?:\/\//.test(href);
}

function slugify(input: string): string {
  const s = input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return s || "section";
}

function nodeText(node: ReactNode): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (React.isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return nodeText(el.props.children);
  }
  return "";
}

function hashShort(input: string): string {
  return createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function toBase64Utf8(str: string): string {
  return Buffer.from(str, "utf8").toString("base64");
}

function parseCallout(text: string): { kind: CalloutKind; title: string; rest: string } | null {
  const s = text.trim();

  const patterns: Array<{ kind: CalloutKind; title: string; re: RegExp }> = [
    { kind: "tip", title: "Tip", re: /^(?:💡|✨)\s*tip:\s*/i },
    { kind: "note", title: "Note", re: /^(?:📝|📌)\s*note:\s*/i },
    { kind: "warning", title: "Warning", re: /^(?:⚠️|🚧)\s*warning:\s*/i },
    { kind: "info", title: "Info", re: /^(?:ℹ️|🧠)\s*info:\s*/i },
  ];

  for (const p of patterns) {
    if (p.re.test(s)) return { kind: p.kind, title: p.title, rest: s.replace(p.re, "").trim() };
  }

  const plain: Array<{ kind: CalloutKind; title: string; re: RegExp }> = [
    { kind: "tip", title: "Tip", re: /^tip:\s*/i },
    { kind: "note", title: "Note", re: /^note:\s*/i },
    { kind: "warning", title: "Warning", re: /^warning:\s*/i },
    { kind: "info", title: "Info", re: /^info:\s*/i },
  ];

  for (const p of plain) {
    if (p.re.test(s)) return { kind: p.kind, title: p.title, rest: s.replace(p.re, "").trim() };
  }

  return null;
}

function calloutClasses(kind: CalloutKind): { wrap: string; badge: string } {
  switch (kind) {
    case "tip":
      return {
        wrap: "border-sky-300/55 bg-sky-500/10 text-sky-100 shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
        badge: "bg-sky-400/15 text-sky-200 border-sky-300/30",
      };
    case "note":
      return {
        wrap: "border-cyan-300/55 bg-cyan-500/10 text-sky-100 shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
        badge: "bg-cyan-400/15 text-cyan-200 border-cyan-300/30",
      };
    case "warning":
      return {
        wrap: "border-amber-300/55 bg-amber-500/10 text-sky-100 shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
        badge: "bg-amber-400/15 text-amber-200 border-amber-300/30",
      };
    case "info":
      return {
        wrap: "border-violet-300/55 bg-violet-500/10 text-sky-100 shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
        badge: "bg-violet-400/15 text-violet-200 border-violet-300/30",
      };
  }
}

function getHeadingId(children: ReactNode): { id: string; text: string } {
  const text = nodeText(children).trim();
  return { text, id: slugify(text) };
}

function getCodeFromPreChildren(children: ReactNode): { code: string; lang: string } {
  // react-markdown renders fenced code as: <pre><code class="language-xxx">...</code></pre>
  if (React.isValidElement(children)) {
    const el = children as ReactElement<CodeElProps>;
    const className = el.props.className ?? "";
    const match = className.match(/language-([a-z0-9-]+)/i);
    const lang = match?.[1] ?? "";
    const code = nodeText(el.props.children).replace(/\n$/, "");
    return { code, lang };
  }

  return { code: nodeText(children).replace(/\n$/, ""), lang: "" };
}

function prosePreset(): string {
  return [
    "prose prose-invert max-w-none text-sky-200 leading-relaxed",

    // spacing / rhythm
    "prose-p:my-4 prose-li:my-1 prose-ul:my-4 prose-ol:my-4 prose-hr:my-8",

    // headings
    "prose-headings:scroll-mt-24 prose-headings:font-semibold prose-headings:text-sky-100",
    "prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-0",
    "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4",
    "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3",
    "prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-2",
    "prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2",
    "prose-h3:border-b prose-h3:border-white/5 prose-h3:pb-1",

    // links
    "prose-a:text-sky-300 prose-a:underline prose-a:decoration-sky-300/40 prose-a:underline-offset-4",
    "hover:prose-a:decoration-sky-300/80",

    // bold/em
    "prose-strong:text-sky-200 prose-strong:font-semibold",
    "prose-strong:bg-sky-400/10 prose-strong:px-1 prose-strong:rounded",
    "prose-em:text-sky-200/90 prose-em:not-italic",

    // inline code
    "prose-code:text-sky-100 prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md",
    "prose-code:before:content-[''] prose-code:after:content-['']",

    // code blocks
    "prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl",
    "prose-pre:shadow-[0_18px_60px_rgba(0,0,0,0.35)] prose-pre:overflow-x-auto prose-pre:p-4",

    // blockquotes (default)
    "prose-blockquote:border-l-2 prose-blockquote:border-sky-300/50",
    "prose-blockquote:bg-white/5 prose-blockquote:rounded-xl prose-blockquote:px-4 prose-blockquote:py-3",
    "prose-blockquote:text-sky-100/90 prose-blockquote:not-italic",
    "prose-blockquote:shadow-[0_10px_30px_rgba(0,0,0,0.25)]",

    // tables
    "prose-table:w-full prose-table:border-separate prose-table:border-spacing-0",
    "prose-thead:bg-white/5",
    "prose-th:text-left prose-th:text-sky-100 prose-th:font-semibold prose-th:border-b prose-th:border-white/10 prose-th:px-3 prose-th:py-2",
    "prose-td:border-b prose-td:border-white/5 prose-td:px-3 prose-td:py-2",
    "prose-tr:hover:bg-white/[0.03]",

    // images
    "prose-img:rounded-2xl prose-img:border prose-img:border-white/10",
    "prose-img:shadow-[0_18px_60px_rgba(0,0,0,0.35)]",

    // list markers / HR
    "prose-ul:pl-6 prose-ol:pl-6 prose-li:marker:text-sky-300/70",
    "prose-hr:border-white/10",
  ].join(" ");
}

export default function MarkdownRenderer({ content }: Props) {
  return (
    <div className={prosePreset()}>
      {/* Minimal JS for “Copy” buttons */}
      <script dangerouslySetInnerHTML={{ __html: COPY_SCRIPT }} />

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children, ...props }) => {
            const external = isExternalHref(href);
            return (
              <a
                href={href}
                {...props}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
              >
                {children}
                {external ? " ↗" : null}
              </a>
            );
          },

          // 🔗 Anchors
          h2: ({ children, ...props }) => {
            const { id, text } = getHeadingId(children);
            return (
              <h2 id={id} className="group" {...props}>
                <a href={`#${id}`} className="no-underline" aria-label={`Link to ${text}`}>
                  {children}
                  <span className="ml-2 align-middle text-sky-300/70 opacity-0 transition group-hover:opacity-100">
                    🔗
                  </span>
                </a>
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const { id, text } = getHeadingId(children);
            return (
              <h3 id={id} className="group" {...props}>
                <a href={`#${id}`} className="no-underline" aria-label={`Link to ${text}`}>
                  {children}
                  <span className="ml-2 align-middle text-sky-300/70 opacity-0 transition group-hover:opacity-100">
                    🔗
                  </span>
                </a>
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const { id, text } = getHeadingId(children);
            return (
              <h4 id={id} className="group" {...props}>
                <a href={`#${id}`} className="no-underline" aria-label={`Link to ${text}`}>
                  {children}
                  <span className="ml-2 align-middle text-sky-300/70 opacity-0 transition group-hover:opacity-100">
                    🔗
                  </span>
                </a>
              </h4>
            );
          },

          // 💡 Callouts via blockquote prefix
          blockquote: ({ children, ...props }) => {
            const raw = nodeText(children);
            const parsed = parseCallout(raw);

            if (!parsed) {
              return <blockquote {...props}>{children}</blockquote>;
            }

            const { wrap, badge } = calloutClasses(parsed.kind);

            return (
              <div className={["my-6 rounded-2xl border p-4 backdrop-blur-xl", wrap].join(" ")}>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
                      badge,
                    ].join(" ")}
                  >
                    {parsed.title}
                  </span>
                </div>
                <div className="text-sm leading-relaxed text-sky-100/90">{parsed.rest}</div>
              </div>
            );
          },

          // 📋 Copy button (wraps <pre>)
          pre: ({ children, ...props }) => {
            const { code, lang } = getCodeFromPreChildren(children);
            const id = `code-${hashShort(code + lang)}`;
            const b64 = toBase64Utf8(code);

            return (
              <div className="relative my-6">
                <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
                  {lang ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-sky-200/80">
                      {lang}
                    </span>
                  ) : null}

                  <button
                    type="button"
                    data-md-copy="true"
                    data-code-b64={b64}
                    aria-controls={id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-sky-100/80 opacity-80 transition hover:opacity-100"
                  >
                    Copy
                  </button>
                </div>

                <pre id={id} {...props}>
                  {children}
                </pre>
              </div>
            );
          },

          // Keep code blocks highlighted; inline code uses prose styles
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className);
            if (!isBlock) return <code {...props}>{children}</code>;
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },

          // Mobile table wrapper
          table: ({ children, ...props }) => (
            <div className="w-full overflow-x-auto">
              <table {...props}>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}