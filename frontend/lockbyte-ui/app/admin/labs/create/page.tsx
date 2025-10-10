import { LabForm } from "@/components/admin/labs/lab-form"
import { Separator } from "@/components/ui/separator"

export default function CreateLabPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Create New Lab</h1>
        <p className="text-white/70">Fill out the form to create a new lab for the platform.</p>
      </div>
      <Separator />
      <LabForm />
    </div>
  )
}
