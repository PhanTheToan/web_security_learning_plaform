"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FlaskConical } from "lucide-react";
import { getLabSessionStatus } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

type LabDifficulty = "Easy" | "Medium" | "Hard" | "Insane";

export type LabInfo = {
  id: number;
  name: string;
  difficulty?: LabDifficulty | string;
};

const StatusBadge = ({ status }: { status: string | null }) => {
  if (!status || status === "EXPIRED") return null;

  const styles: { [key: string]: string } = {
    RUNNING: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    SOLVED: "bg-green-500/10 text-green-300 border-green-500/20",
  };
  const className = styles[status] || "bg-gray-500/10 text-gray-300";
  return <Badge className={className}>{status}</Badge>;
};


function levelBadgeClass(level?: string) {
  switch (level?.toLowerCase()) {
    case "easy":
      return "label-level-easy";
    case "medium":
      return "label-level-medium";
    case "hard":
      return "label-level-hard";
    case "insane":
      return "label-level-insane";
    default:
      return "label-level-unknown";
  }
}

export default function LabLinkWidget({
  href,
  fallbackText,
  labInfo,
}: {
  href: string;
  fallbackText?: string;
  labInfo?: LabInfo;
}) {
  const idMatch = href.match(/\/labs\/(\d+)/);
  const labId = idMatch ? Number(idMatch[1]) : undefined;

  const [lab, setLab] = useState<LabInfo | null>(labInfo ?? null);
  const [loading, setLoading] = useState(!labInfo);
  const [status, setStatus] = useState<string | null>(null);

  const widgetId = useMemo(
    () => (labId ? `labs-${labId}` : `labs-${Math.random().toString(36).slice(2)}`),
    [labId]
  );

  useEffect(() => {
    if (labId) {
      getLabSessionStatus(labId)
        .then(statusResult => {
          if (statusResult?.startsWith("RUNNING")) {
            setStatus("RUNNING");
          } else {
            setStatus(statusResult);
          }
        })
        .catch(() => setStatus("EXPIRED"));
    }

    if (!labInfo && labId) {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082/api";
      const url = `${apiBase}/public/labs/${labId}`;
      
      setLoading(true);
      fetch(url, { cache: "no-store" })
        .then(res => {
          if (!res.ok) throw new Error(`Failed ${res.status}`);
          return res.json();
        })
        .then(data => {
          setLab({
            id: data.id,
            name: data.name ?? data.title,
            difficulty: data.difficulty ?? data.level ?? "Easy",
          });
        })
        .catch(() => {
          setLab({
            id: labId,
            name: fallbackText ?? `Lab #${labId}`,
            difficulty: "Easy",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [labId, fallbackText, labInfo]);

  if (loading || !lab) {
    return (
      <div
        id={widgetId}
        className="widgetcontainer-lab-link flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 animate-pulse font-mono"
      >
        <FlaskConical className="w-5 h-5 text-purple-400/60" />
        <div className="flex-1 h-4 bg-white/10 rounded" />
        <span className="w-16 h-4 bg-white/10 rounded" />
      </div>
    );
  }

  return (
    <div
      id={widgetId}
      className="widgetcontainer-lab-link rounded-lg border border-white/10 bg-white/5 p-3 my-2 flex items-center justify-between gap-3 transition-colors duration-300 font-mono"
    >
      <FlaskConical className="w-5 h-5 text-purple-400" />

      <div className="flex-columns flex-1 flex items-center gap-2 min-w-0">
        <span className={levelBadgeClass(lab.difficulty)}>{lab.difficulty ?? "UNKNOWN"}</span>
        <Link href={href} className="truncate text-purple-300 link-glow-effect text-sm">
          {lab.name ?? fallbackText ?? href}
        </Link>
      </div>

      <StatusBadge status={status} />
    </div>
  );
}