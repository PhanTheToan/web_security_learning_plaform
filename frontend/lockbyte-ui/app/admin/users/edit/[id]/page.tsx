"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UserForm } from "@/components/admin/users/user-form";

type User = {
  id: number;
  username: string;
  fullName: string;
  address: string;
  dateOfBirth: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  eStatus: "Active" | "Inactive";
  roles: string[];
  roleIds: number[];
};

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`;
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
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Edit User</h1>
        <p className="text-white/70">Update the details for this user.</p>
      </div>
      {loading && <p className="text-white/80">Loading user…</p>}
      {err && <p className="text-red-400">Error: {err}</p>}
      {data && <UserForm initialData={data} />}
    </div>
  );
}
