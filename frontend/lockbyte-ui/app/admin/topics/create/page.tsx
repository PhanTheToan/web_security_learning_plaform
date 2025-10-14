import { TopicForm } from "@/components/admin/topics/topic-form";

export default function CreateTopicPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Create New Topic</h1>
        <p className="text-white/70">Fill out the form below to create a new topic.</p>
      </div>
      <TopicForm initialData={null} />
    </div>
  );
}