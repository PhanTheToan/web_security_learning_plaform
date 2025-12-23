import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (payload: { emails?: string[]; userIds?: number[] }) => void | Promise<void>;
};

export function AddMembersDialog({ open, onOpenChange, onSubmit }: Props) {
  const [userIdsText, setUserIdsText] = useState("");
  const [saving, setSaving] = useState(false);

  const parsed = useMemo(() => {
    const userIds = userIdsText
      .split(/[\n,;]/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((n) => Number.isFinite(n) && n > 0);

    return { userIds };
  }, [userIdsText]);

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        userIds: parsed.userIds.length ? parsed.userIds : undefined,
      });
      onOpenChange(false);
      setUserIdsText("");
    } finally {
      setSaving(false);
    }
  };

  const canSubmit = parsed.userIds.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-white/10 bg-gray-950 text-white">
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>User IDs (one per line, or separated by comma)</Label>
            <Textarea
              className="min-h-[120px] border-purple-500/30 bg-white/5 text-white"
              value={userIdsText}
              onChange={(e) => setUserIdsText(e.target.value)}
              placeholder="1\n2\n3"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={saving || !canSubmit} className="text-white">
              {saving ? "Saving..." : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
