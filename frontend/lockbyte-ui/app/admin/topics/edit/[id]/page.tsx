'use client';

import { TopicForm } from "@/components/admin/topics/topic-form";
import { useParams } from 'next/navigation';

export default function EditTopicPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Edit Topic #{id}</h1>
          <p className="text-white/70">Update the details of the topic below.</p>
        </div>
      </div>
      {/* In a real app, you would fetch the topic data using the id and pass it to the form */}
      <TopicForm />
    </div>
  );
}
