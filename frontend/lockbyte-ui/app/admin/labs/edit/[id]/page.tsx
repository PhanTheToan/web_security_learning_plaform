'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { LabForm } from '@/components/admin/labs/lab-form';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Assuming Lab data structure from the API response
interface LabData {
  id: number;
  name: string;
  description: string;
  solution: string;
  hint: string;
  fixVulnerabilities: string;
  dockerImage: string;
  difficulty: string;
  timeoutMinutes: number;
  status: string;
  tags: { id: number; name: string }[];
}

export default function EditLabPage() {
  const params = useParams();
  const { id } = params;

  const [labData, setLabData] = useState<LabData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLab = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/labs/${id}`;
        const res = await fetch(apiUrl, {
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch lab data.');
        }
        const data = await res.json();
        setLabData(data);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : "An unknown error occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLab();
  }, [id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white/90">Edit Lab</h1>
        <p className="text-white/70">Update the details for this lab.</p>
      </div>
      <Separator />

      {isLoading && <p>Loading lab data...</p>}
      {error && <p className="text-destructive">Error: {error}</p>}
      {labData && <LabForm mode="edit" initialData={labData} />}
    </div>
  );
}
