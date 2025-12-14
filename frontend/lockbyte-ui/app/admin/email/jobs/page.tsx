"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";

import { listEmailJobs, getEmailJob, pauseEmailJob, resumeEmailJob, cancelEmailJob } from "@/lib/api";
import type { EmailJob, EmailJobStatus } from "@/types/email-jobs";

import { JobsToolbar } from "@/components/admin/email/jobs/jobs-toolbar";
import { JobsTable } from "@/components/admin/email/jobs/jobs-table";
import { JobDetailDrawer } from "@/components/admin/email/jobs/job-detail-drawer";

export default function EmailJobsPage() {
  const [jobs, setJobs] = useState<EmailJob[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const [status, setStatus] = useState<EmailJobStatus | "ALL">("ALL");
  const [groupId, setGroupId] = useState<string>(""); // input string
  const [keyword, setKeyword] = useState(""); // client-side filter by id/subject

  const [loading, setLoading] = useState(false);

  // Detail drawer
  const [openDetail, setOpenDetail] = useState(false);
  const [activeJob, setActiveJob] = useState<EmailJob | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const query = useMemo(() => {
    const gid = groupId.trim() ? Number(groupId.trim()) : undefined;
    return {
      page,
      size,
      status: status === "ALL" ? undefined : status,
      groupId: Number.isFinite(gid as any) ? gid : undefined,
    };
  }, [page, size, status, groupId]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const resp = await listEmailJobs(query);
      setJobs(resp.content ?? []);
      setTotal(resp.totalElements ?? 0);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load email jobs." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.size, query.status, query.groupId]);

  const filteredJobs = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => {
      const id = (j.id ?? "").toLowerCase();
      const subject = (j.subject ?? "").toLowerCase();
      return id.includes(q) || subject.includes(q);
    });
  }, [jobs, keyword]);

  const openJobDetail = async (jobId: string) => {
    setOpenDetail(true);
    setLoadingDetail(true);
    try {
      const detail = await getEmailJob(jobId);
      setActiveJob(detail);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load job detail." });
      setOpenDetail(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const doAction = async (job: EmailJob, action: "pause" | "resume" | "cancel") => {
    try {
      if (action === "pause") await pauseEmailJob(job.id);
      if (action === "resume") await resumeEmailJob(job.id);
      if (action === "cancel") await cancelEmailJob(job.id);

      toast({ title: "OK", description: `Job ${action} requested.` });

      // refresh list + refresh detail if opening
      fetchJobs();
      if (openDetail && activeJob?.id === job.id) {
        const detail = await getEmailJob(job.id);
        setActiveJob(detail);
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message ?? "Job action failed." });
    }
  };

  return (
    <div className="space-y-6 p-6 text-white">
      <JobsToolbar
        keyword={keyword}
        onKeywordChange={setKeyword}
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(0);
        }}
        groupId={groupId}
        onGroupIdChange={(v) => {
          setGroupId(v);
          setPage(0);
        }}
        onRefresh={fetchJobs}
        isRefreshing={loading}
      />

      <JobsTable
        data={filteredJobs}
        loading={loading}
        page={page}
        size={size}
        total={total}
        onPageChange={setPage}
        onSizeChange={(s) => {
          setSize(s);
          setPage(0);
        }}
        onView={(job) => openJobDetail(job.id)}
        onPause={(job) => doAction(job, "pause")}
        onResume={(job) => doAction(job, "resume")}
        onCancel={(job) => doAction(job, "cancel")}
      />

      <JobDetailDrawer
        open={openDetail}
        onOpenChange={setOpenDetail}
        loading={loadingDetail}
        job={activeJob}
        onPause={(job) => doAction(job, "pause")}
        onResume={(job) => doAction(job, "resume")}
        onCancel={(job) => doAction(job, "cancel")}
        onRefresh={async () => activeJob?.id && openJobDetail(activeJob.id)}
      />
    </div>
  );
}
