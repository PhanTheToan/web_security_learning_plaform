"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ParticlesComponent from "@/components/particles-background";

import { ArrowRight } from "lucide-react";
import LabLinkWidget from "@/components/LabLinkWidget";
import MarkdownImage from "@/components/MarkdownImage";

/** ========= Types ========= */
type Lab = { id: number; name: string; estatus: string };
type TopicDetail = {
  id: number;
  title: string;
  content: string;
  status: "Draft" | "Published";
  labs: Lab[];
  tags: { id: number; name: string }[];
};

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

function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

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
      <div className="pointer-events-none absolute left-0 top-0 h-full w-[3px] rounded-lg bg-gradient-to-b from-purple-500/70 via-fuchsia-500/60 to-blue-500/70" />
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-2 text-[11px] px-2 py-0.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>

      {/* ⬇️ Nhường nền & padding cho CSS .prose pre (giữ nguyên config ban đầu) */}
      <pre className="overflow-x-auto rounded-xl border border-white/10 p-4">
        <code className="bg-transparent p-0" style={{ fontSize: "13px", lineHeight: "1.6" }}>
          {text}
        </code>
      </pre>
    </div>
  );
}

export default function TopicDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082/api";
    const url = `${apiBase}/public/topic/${id}`; // theo bạn xác nhận

    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const data = (await res.json()) as TopicDetail;
        setTopic(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const preparedContent = useMemo(
    () => (topic?.content ? fixUnclosedFences(topic.content) : ""),
    [topic?.content]
  );

  if (loading) return <div className="p-6 text-white/80">Loading…</div>;
  if (err) return <div className="p-6 text-red-400">Error: {err}</div>;
  if (!topic) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParticlesComponent id="tsparticles" />
      <Header />
      <main className="relative z-10">
        <div className="container mx-auto px-4 py-10">
          {/* breadcrumb */}
          <nav className="text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/topics" className="hover:text-white">Topics</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{topic.title}</span>
          </nav>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-normal">{topic.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-md bg-white/10 px-2 py-1 text-xs">
              {topic.status}
            </div>
            {topic.tags?.map(tag => (
              <div key={tag.id} className="inline-flex rounded-md bg-blue-500/10 px-2 py-1 text-xs text-blue-300">
                {tag.name}
              </div>
            ))}
          </div>

          {/* GRID: Content + Related Labs */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* CONTENT */}
            <article className="lg:col-span-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/8 via-purple-500/5 to-blue-500/8 backdrop-blur-sm p-6">
              <div
                className="
                  prose prose-invert max-w-none font-sans prose-code:font-mono prose-pre:font-mono
                  prose-headings:font-semibold
                  /* link tím */
                  prose-a:text-purple-300 hover:prose-a:text-purple-200 prose-a:underline underline-offset-2 decoration-purple-400/40
                  prose-strong:text-white
                  prose-code:bg-muted prose-pre:bg-muted
                  prose-ul:list-disc prose-ol:list-decimal
                  prose-li:my-1 prose-ul:pl-6 prose-ol:pl-6
                "
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (p) => <h1 {...p} className="text-4xl sm:text-5xl font-bold tracking-normal mt-8 mb-4" />,
                    h2: (p) => <h2 {...p} className="text-2xl sm:text-3xl font-semibold mt-10 pt-6 mb-3 border-t border-white/10" />,
                    h3: (p) => <h3 {...p} className="text-xl sm:text-2xl font-semibold mt-8 mb-2" />,
                    h4: (p) => <h4 {...p} className="text-lg sm:text-xl font-semibold mt-6 mb-2" />,

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

                    // CODE BLOCK — chỉ qua <pre> (nhường nền cho CSS .prose pre)
                    pre({ children }) {
                      return <CodeBlock>{children}</CodeBlock>;
                    },

                    // Image Popup
                    img: (p) => <MarkdownImage {...p} />,

                    // Links
                    a: ({ href = "", children, ...props }) => {
                      if (/^\/labs\/\d+\/?$/.test(href)) {
                        const labId = Number(href.match(/\/labs\/(\d+)/)?.[1]);
                        const labData = topic.labs?.find(lab => lab.id === labId);
                        const text = Array.isArray(children) ? children.join("") : String(children ?? "");
                        return <LabLinkWidget href={href} fallbackText={text} labInfo={labData} />;
                      }
                      return (
                        <a href={href} {...props} className="text-purple-300 link-glow-effect">
                          {children}
                        </a>
                      );
                    },
                  }}
                >
                  {preparedContent}
                </ReactMarkdown>
              </div>
            </article>

            {/* RELATED LABS */}
            {topic.labs?.length > 0 && (
              <aside className="lg:sticky lg:top-24 h-fit rounded-xl border border-white/10 bg-gradient-to-br from-white/8 via-purple-500/5 to-blue-500/8 backdrop-blur-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Related Labs</h2>
                <ul className="space-y-3">
                  {topic.labs.map((lab) => (
                    <li
                      key={lab.id}
                      className="flex items-start justify-between rounded-lg border border-white/10 px-3 py-2 hover:border-purple-500/60 transition-colors"
                    >
                      <div className="pr-2">
                        <div className="font-medium">{lab.name}</div>
                        <div className="text-xs text-white/60">{lab.estatus}</div>
                      </div>
                      <Link
                        href={`/labs/${lab.id}`}
                        className="text-purple-300 hover:text-purple-200 shrink-0"
                        aria-label={`View lab: ${lab.name}`}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
