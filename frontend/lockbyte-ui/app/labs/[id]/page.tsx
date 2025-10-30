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
import { getPublicLabById, LabDetail, getLabSessionStatus, startLabSession, submitLabFlag } from "@/lib/api";
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
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import MarkdownImage from "@/components/MarkdownImage";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

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
          img: (p) => <MarkdownImage {...p} />,
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

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    RUNNING: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    SOLVED: "bg-green-500/10 text-green-300 border-green-500/20",
    EXPIRED: "bg-gray-500/10 text-gray-300 border-gray-500/20",
  };
  const className = styles[status as keyof typeof styles] || "bg-gray-500/10 text-gray-300";
  return <Badge className={className}>{status}</Badge>
}

export default function LabDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { toast } = useToast();

  const [lab, setLab] = useState<LabDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labStatus, setLabStatus] = useState("EXPIRED");
  const [labSessionId, setLabSessionId] = useState<number | null>(null);
  const [runningLabUrl, setRunningLabUrl] = useState<string | null>(null);
  const [isStartingLab, setIsStartingLab] = useState(false);
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [flag, setFlag] = useState("");

  const fetchStatus = async () => {
    if (!id) return;
    try {
      const statusResult = await getLabSessionStatus(id);
      if (statusResult.startsWith("RUNNING")) {
        const match = statusResult.match(/RUNNING - ID: (\d+) - URL: (.*)/);
        if (match) {
          const [, sessionId, url] = match;
          setLabSessionId(parseInt(sessionId, 10));
          setRunningLabUrl(url);
        } else {
          // Fallback for the old format
          const sessionId = parseInt(statusResult.split(": ")[1], 10);
          setLabSessionId(sessionId);
          setRunningLabUrl(null); // No URL available in old format
        }
        setLabStatus("RUNNING");
      } else {
        setLabStatus(statusResult);
        setRunningLabUrl(null);
      }
    } catch (err) {
      setLabStatus("EXPIRED"); // Default to EXPIRED on error
      setRunningLabUrl(null);
    }
  };

  useEffect(() => {
    if (!id) return;
    async function fetchLab() {
      try {
        const data = await getPublicLabById(id);
        setLab(data);
        await fetchStatus();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchLab();
  }, [id]);

  const handleAccessLab = async () => {
    if (!id) return;
    setIsStartingLab(true);
    try {
      const result = await startLabSession(id);
      toast({
        title: (
          <div className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            <span className="font-bold">Lab Started Successfully!</span>
          </div>
        ),
        description: "Redirecting to your lab environment...",
      });
      setTimeout(() => {
        window.open(result.url, '_blank');
        fetchStatus(); // Re-fetch status after starting
      }, 3000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <XCircle className="mr-2 h-5 w-5" />
            <span className="font-bold">Failed to Start Lab</span>
          </div>
        ),
        description: "Tạo labs không thành công. Vui lòng tạo lại!",
      });
    } finally {
      setIsStartingLab(false);
    }
  };

  const handleSubmitFlag = async () => {
    if (!id || !labSessionId || !flag) return;
    setIsSubmittingFlag(true);
    try {
      const result = await submitLabFlag(id, labSessionId, flag);
      if (result === "Flag is correct! Lab completed.") {
        toast({
          title: (
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              <span className="font-bold">Success!</span>
            </div>
          ),
          description: result,
        });
        fetchStatus(); // Re-fetch to update status to SOLVED
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center">
              <XCircle className="mr-2 h-5 w-5" />
              <span className="font-bold">Submission Failed</span>
            </div>
          ),
          description: result,
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center">
            <XCircle className="mr-2 h-5 w-5" />
            <span className="font-bold">Error</span>
          </div>
        ),
        description: err instanceof Error ? err.message : "An unexpected error occurred.",
      });
    } finally {
      setIsSubmittingFlag(false);
    }
  };


  if (loading) return <LabDetailLoading />;
  if (error) return <div className="p-6 text-center text-red-400">Error: {error}</div>;
  if (!lab) return <div className="p-6 text-center text-white/80">Lab not found.</div>;

  const renderAccessButton = () => {
    if (labStatus === 'RUNNING') {
      if (runningLabUrl) {
        return (
          <a href={runningLabUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6">
              LAB IS RUNNING
            </Button>
          </a>
        );
      }
      // Fallback if URL is not available
      return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-6" disabled>
          LAB IS RUNNING
        </Button>
      );
    }

    return (
      <Button
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg py-6"
        onClick={handleAccessLab}
        disabled={isStartingLab}
      >
        {isStartingLab && <Loader2 className="mr-3 h-6 w-6 animate-spin" />}
        {labStatus === 'SOLVED' ? 'REACTIVE' : 'ACCESS THE LAB'}
      </Button>
    );
  };

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
                    <StatusBadge status={labStatus} />
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

              {renderAccessButton()}

              {labStatus === 'RUNNING' && (
                <div className="space-y-4 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-blue-500/8 p-6">
                  <h2 className="text-2xl font-semibold flex items-center"><Flag className="mr-3 h-6 w-6 text-green-400" />Submit Flag</h2>
                  <div className="flex items-center gap-4">
                    <Input
                      type="text"
                      placeholder="CyLock{...}"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      className="flex-grow bg-slate-800/60 border-slate-700"
                    />
                    <Button
                      onClick={handleSubmitFlag}
                      disabled={isSubmittingFlag}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmittingFlag && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Submit
                    </Button>
                  </div>
                </div>
              )}


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
