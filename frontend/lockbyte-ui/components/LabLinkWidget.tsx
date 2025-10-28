"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FlaskConical } from "lucide-react";

type LabDifficulty = "Easy" | "Medium" | "Hard" | "Insane";

// This type should match the structure of lab objects from your APIs
export type LabInfo = {
  id: number;
  name: string;
  difficulty?: LabDifficulty | string; // Allow string for flexibility
  solved?: boolean;
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
  labInfo, // Accept pre-fetched lab info
}: {
  href: string;
  fallbackText?: string;
  labInfo?: LabInfo;
}) {
  const idMatch = href.match(/\/labs\/(\d+)/);
  const labId = idMatch ? Number(idMatch[1]) : undefined;

  const [lab, setLab] = useState<LabInfo | null>(labInfo ?? null);
  const [loading, setLoading] = useState(!labInfo);

  const widgetId = useMemo(
    () => (labId ? `labs-${labId}` : `labs-${Math.random().toString(36).slice(2)}`),
    [labId]
  );

  useEffect(() => {
    // Only fetch if labId exists AND labInfo was not provided
    if (!labId || labInfo) {
      return;
    }

    const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082/api";
    const url = `${apiBase}/public/labs/${labId}`;
    
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed ${res.status}`);
        const data = await res.json();
        setLab({
          id: data.id,
          name: data.name ?? data.title,
          difficulty: data.difficulty ?? data.level ?? "Easy",
          solved: data.solved ?? false,
        });
      } catch {
        setLab({
          id: labId,
          name: fallbackText ?? `Lab #${labId}`,
          difficulty: "Easy",
          solved: false,
        });
      } finally {
        setLoading(false);
      }
    })();
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
      className={[
        "widgetcontainer-lab-link",
        "rounded-lg border border-white/10 bg-white/5 p-3 my-2",
        "flex items-center justify-between gap-3 transition-colors duration-300 font-mono",
        lab.solved ? "is-solved" : "",
      ].join(" ")}
    >
      <FlaskConical className="w-5 h-5 text-purple-400" />

      <div className="flex-columns flex-1 flex items-center gap-2 min-w-0">
        <span className={levelBadgeClass(lab.difficulty)}>{lab.difficulty ?? "UNKNOWN"}</span>
        <Link href={href} className="truncate text-purple-300 link-glow-effect text-sm">
          {lab.name ?? fallbackText ?? href}
        </Link>
      </div>

      <span className="lab-status-icon text-xs text-emerald-300 font-semibold">
        {lab.solved ? "Solved" : ""}
      </span>
    </div>
  );
}