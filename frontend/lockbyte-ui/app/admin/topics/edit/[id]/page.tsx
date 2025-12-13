"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TopicForm } from "@/components/admin/topics/topic-form";

type Lab = { id: number; name: string; estatus: string };
type TopicDetail = {
  id: number;
  title: string;
  content: string;
  status: "Draft" | "Published";
  labs: Lab[];
  tags: { id: number; name: string }[];
};

export default function EditTopicPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [data, setData] = useState<TopicDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/topics/${id}`;
    (async () => {
      try {
        const res = await fetch(apiUrl, { credentials: "include", cache: "no-store" });
        if (!res.ok) throw new Error(`Failed with ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Edit Topic</h1>
        <p className="text-white/70">Update the details for this topic.</p>
      </div>
      {loading && <p className="text-white/80">Loading topic…</p>}
      {err && <p className="text-red-400">Error: {err}</p>}
      {data && <TopicForm initialData={data} />}
    </div>
  );
}
