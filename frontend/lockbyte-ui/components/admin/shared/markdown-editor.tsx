"use client";

import React, { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import LabLinkWidget from "@/components/LabLinkWidget";

import { LabInfo } from "@/components/LabLinkWidget";
import MarkdownImage from "@/components/MarkdownImage";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  height?: string;
  labs?: LabInfo[];
}

/** ========= Utils: vá code fence hở (support ``` và ~~~) ========= */
function fixUnclosedFences(md: string) {
  const lines = md.split(/\r?\n/);
  const stack: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*(```|~~~)/);
    if (!m) continue;
    const fence = m[1];
    const top = stack[stack.length - 1];
    if (!top) stack.push(fence);
    else if (top === fence) stack.pop();
    else stack.push(fence);
  }

  if (stack.length) {
    const closing = stack.reverse().join("\n");
    return md.replace(/\s*$/, `\n${closing}\n`);
  }
  return md;
}

/** ========= CodeBlock Preview (nhường nền cho CSS .prose pre) ========= */
function CodeBlockPreview({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  // Lấy lang + text từ <code> bên trong <pre>

  let text = "";

  const child: React.ReactElement = Array.isArray(children) ? children[0] : children;
  if (child && child.props) {
    const raw = child.props.children;
    text = String(Array.isArray(raw) ? raw.join("") : raw ?? "").replace(/\n+$/, "");
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  }

  return (
    <div className="relative group my-4">

      <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-l-xl bg-gradient-to-b from-purple-500/70 via-fuchsia-500/60 to-blue-500/70" />

      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-2 text-[11px] px-2 py-0.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* Nhường nền/padding chính cho .prose pre trong CSS global; ở đây chỉ thêm viền + p-4 để khớp */}
      <pre className="overflow-x-auto rounded-xl border border-white/10 p-4">
        <code className="bg-transparent p-0" style={{ fontSize: "13px", lineHeight: "1.6" }}>
          {text}
        </code>
      </pre>
    </div>
  );
}

const MarkdownEditor = ({
  value,
  onChange,
  textareaRef,
  height = "h-96",
  labs = [],
}: MarkdownEditorProps) => {
  const prepared = useMemo(() => fixUnclosedFences(value ?? ""), [value]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${height} p-4 border-2 border-primary/40 rounded-xl bg-card/50 backdrop-blur-sm font-mono text-sm text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary/60 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]`}
          placeholder="Enter markdown content here...
          
Example for image: ![Alt text](image_url)"
        />
      </div>

      <div
        className={`prose prose-invert max-w-none font-sans prose-code:font-mono prose-pre:font-mono p-4 border-2 border-primary/40 rounded-xl bg-card/50 backdrop-blur-sm overflow-auto ${height} shadow-[0_0_15px_rgba(99,102,241,0.1)] text-white`}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            h1: (p) => (
              <h1
                {...p}
                className="text-4xl sm:text-5xl font-bold tracking-normal mt-8 mb-4"
              />
            ),
            h2: (p) => (
              <h2
                {...p}
                className="text-2xl sm:text-3xl font-semibold mt-10 pt-6 mb-3 border-t border-white/10"
              />
            ),
            h3: (p) => (
              <h3
                {...p}
                className="text-xl sm:text-2xl font-semibold mt-8 mb-2"
              />
            ),
            h4: (p) => (
              <h4
                {...p}
                className="text-lg sm:text-xl font-semibold mt-6 mb-2"
              />
            ),

            a: ({ href = "", children, ...props }) => {
              if (/^\/labs\/\d+\/?$/.test(href)) {
                const labId = Number(href.match(/\/labs\/(\d+)/)?.[1]);
                const labData = labs.find(lab => lab.id === labId);
                const text = Array.isArray(children) ? children.join("") : String(children ?? "");
                return <LabLinkWidget href={href} fallbackText={text} labInfo={labData} />;
              }
              return (
                <a
                  href={href}
                  {...props}
                  className="text-purple-300 link-glow-effect"
                >
                  {children}
                </a>
              );
            },

            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              if (!match) {
                return (
                  <code
                    {...props}
                    className="
                      rounded-md
                      bg-gradient-to-r from-purple-500/12 via-indigo-500/10 to-fuchsia-500/12
                      text-purple-50
                      ring-1 ring-purple-400/25
                      px-2 py-[2px] text-[0.9em] font-medium
                    "
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },

            pre({ children }) {
              return <CodeBlockPreview>{children}</CodeBlockPreview>;
            },

            img: (p) => <MarkdownImage {...p} />,
          }}
        >
          {prepared}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownEditor;
