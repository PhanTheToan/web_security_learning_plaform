"use client";

import type { EmailJob } from "@/types/email-jobs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function canPause(status: string) {
  return status === "RUNNING";
}
function canResume(status: string) {
  return status === "PAUSED";
}
function canCancel(status: string) {
  return status === "QUEUED" || status === "RUNNING" || status === "PAUSED";
}

export function JobDetailDrawer(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  loading: boolean;
  job: EmailJob | null;

  onPause: (job: EmailJob) => void;
  onResume: (job: EmailJob) => void;
  onCancel: (job: EmailJob) => void;
  onRefresh: () => void;
}) {
  const j = props.job;
  const buttonStyles = "bg-transparent border-white/20 hover:bg-white/10";

  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent className="w-full sm:max-w-[560px] bg-gray-900/90 backdrop-blur-sm border-l border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Email Job Detail</SheetTitle>
        </SheetHeader>

        {props.loading || !j ? (
          <div className="mt-6 text-sm text-gray-400">Loading...</div>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <div className="text-xs text-gray-400">Job ID</div>
              <div className="font-mono text-xs break-all text-gray-300">{j.id}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{j.status}</Badge>
              <div className="text-sm text-gray-400">
                groupId: {j.groupId ?? "-"} • template: {j.templateName ?? "-"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-gray-400">Subject</div>
              <div className="text-sm text-white">{j.subject ?? "-"}</div>
            </div>

            <div className="rounded-md border border-white/10 p-3 text-sm bg-white/5">
              <div>
                Progress: {j.sent}/{j.total} • failed: {j.failed}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                createdAt: {j.createdAt ?? "-"}
                <br />
                startedAt: {j.startedAt ?? "-"}
                <br />
                finishedAt: {j.finishedAt ?? "-"}
              </div>
            </div>

            {j.lastError ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                <div className="text-xs text-red-400 mb-1">Last error</div>
                <pre className="whitespace-pre-wrap text-xs text-red-300">{j.lastError}</pre>
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={buttonStyles}>Job Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-white/20 text-white rounded-2xl bg-white/5 bg-blurbg-card/95 text-white shadow-xl backdrop-blur-sm">
                  <DropdownMenuItem onClick={() => props.onPause(j)} disabled={!canPause(j.status)} className="hover:bg-white/10 focus:bg-white/10 rounded-2xl">
                    Pause
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => props.onResume(j)} disabled={!canResume(j.status)} className="hover:bg-white/10 focus:bg-white/10  rounded-2xl">
                    Resume
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 hover:bg-white/10 focus:bg-white/10 rounded-2xl"
                    onClick={() => props.onCancel(j)}
                    disabled={!canCancel(j.status)}
                  >
                    Cancel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
