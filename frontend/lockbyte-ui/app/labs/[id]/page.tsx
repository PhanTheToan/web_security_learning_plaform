"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ParticlesComponent from "@/components/particles-background";
import { getPublicLabById, LabDetail } from "@/lib/api";
import LabDetailLoading from "./loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileDown,
  Flag,
  HelpCircle,
  Share2,
  ShieldCheck,
  Users,
} from "lucide-react";

// Reusing markdown rendering logic from Topic Detail Page
function fixUnclosedFences(md: string) {
  if (!md) return "";
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
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-3 top-2 text-[11px] px-2 py-0.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 transition"
        aria-label="Copy code"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-xl border border-white/10 bg-gray-900/70 p-4">
        <code className="bg-transparent p-0 text-sm">{text}</code>
      </pre>
    </div>
  );
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  const preparedContent = useMemo(() => fixUnclosedFences(content), [content]);
  return (
    <div className="prose prose-invert max-w-none prose-a:text-purple-300 hover:prose-a:text-purple-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
        }}
      >
        {preparedContent}
      </ReactMarkdown>
    </div>
  );
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const styles = {
    Beginner: "bg-green-500/10 text-green-300 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-300 border-red-500/20",
    Expert: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  };
  const className = styles[difficulty as keyof typeof styles] || "bg-gray-500/10 text-gray-300";
  return <Badge className={className}>{difficulty}</Badge>
}

export default function LabDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    async function fetchLab() {
      if (!id) return; // Type guard
      try {
        const data = await getPublicLabById(id);
        setLab(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLab();
  }, [id]);

  if (loading) return <LabDetailLoading />;
  if (error) return <div className="p-6 text-center text-red-400">Error: {error}</div>;
  if (!lab) return <div className="p-6 text-center text-white/80">Lab not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ParticlesComponent id="tsparticles" />
      <Header />
      <main className="relative z-10">
        <div className="container mx-auto max-w-4xl px-4 py-10">
          <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 sm:p-8">
            <header className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{lab.name}</h1>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <DifficultyBadge difficulty={lab.difficulty} />
                    {lab.tags?.map(tag => (
                      <Badge key={tag.id} variant="secondary" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </header>

            <div className="space-y-6">
              <article className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/8 p-6">
                <h2 className="text-2xl font-semibold mb-4 flex items-center"><BookOpen className="mr-3 h-6 w-6 text-purple-400" />Description</h2>
                <MarkdownRenderer content={lab.description} />
              </article>

              {lab.linkSource && (
                <a href={lab.linkSource} download target="_blank" rel="noopener noreferrer" className="block">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-6">
                    <FileDown className="mr-3 h-6 w-6" />
                    Download Lab Files
                  </Button>
                </a>
              )}

              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-6">
                <Flag className="mr-3 h-6 w-6" />
                ACCESS THE LAB
              </Button>

              <Accordion type="single" collapsible className="w-full rounded-xl border border-white/10 bg-gradient-to-br from-white/5 via-purple-500/5 to-blue-500/8 px-6">
                {lab.hint && (
                  <AccordionItem value="hint">
                    <AccordionTrigger><HelpCircle className="mr-3 h-5 w-5 text-yellow-400" />Hint</AccordionTrigger>
                    <AccordionContent>
                      <MarkdownRenderer content={lab.hint} />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {lab.solution && (
                  <AccordionItem value="solution">
                    <AccordionTrigger><BookOpen className="mr-3 h-5 w-5 text-green-400" />Solution</AccordionTrigger>
                    <AccordionContent>
                      <MarkdownRenderer content={lab.solution} />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {lab.fixVulnerabilities && (
                  <AccordionItem value="fixVulnerabilities">
                    <AccordionTrigger><ShieldCheck className="mr-3 h-5 w-5 text-blue-400" />Vulnerability Fix</AccordionTrigger>
                    <AccordionContent>
                      <MarkdownRenderer content={lab.fixVulnerabilities} />
                    </AccordionContent>
                  </AccordionItem>
                )}
                {lab.communitySolutionDTOS?.length > 0 && (
                  <AccordionItem value="community">
                    <AccordionTrigger><Users className="mr-3 h-5 w-5 text-teal-400" />Community Solutions</AccordionTrigger>
                    <AccordionContent>
                      {/* Render community solutions here */}
                      <p>Community solutions will be displayed here.</p>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
