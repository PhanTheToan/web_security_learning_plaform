import { UserForm } from "@/components/admin/users/user-form";

export default function CreateUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Create New User</h1>
        <p className="text-white/70">Fill out the form below to create a new user.</p>
      </div>
      <UserForm initialData={null} />
    </div>
  );
}
