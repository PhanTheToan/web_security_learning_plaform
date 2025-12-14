"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  listEmailGroups,
  createEmailGroup,
  updateEmailGroup,
  deleteEmailGroup,
  listEmailGroupMembers,
  addEmailGroupMembers,
  removeEmailGroupMember,
} from "@/lib/api";

import type { EmailGroup, EmailGroupMember } from "@/types/email";

import { GroupsToolbar } from "./_components/groups-toolbar";
import { GroupsTable } from "./_components/groups-table";
import { GroupDialog } from "./_components/group-dialog";
import { MembersDrawer } from "./_components/members-drawer";

export default function EmailGroupsPage() {
  // ===== Groups state =====
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [groupsTotal, setGroupsTotal] = useState(0);
  const [groupsPage, setGroupsPage] = useState(0);
  const [groupsSize, setGroupsSize] = useState(20);
  const [groupsKeyword, setGroupsKeyword] = useState("");
  const [loadingGroups, setLoadingGroups] = useState(false);

  // ===== Create/Edit dialog =====
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<EmailGroup | null>(null);

  // ===== Members drawer =====
  const [openMembers, setOpenMembers] = useState(false);
  const [activeGroup, setActiveGroup] = useState<EmailGroup | null>(null);

  const [members, setMembers] = useState<EmailGroupMember[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersPage, setMembersPage] = useState(0);
  const [membersSize, setMembersSize] = useState(20);
  const [membersKeyword, setMembersKeyword] = useState("");
  const [loadingMembers, setLoadingMembers] = useState(false);

  const groupsQuery = useMemo(
    () => ({ page: groupsPage, size: groupsSize, keyword: groupsKeyword || undefined }),
    [groupsPage, groupsSize, groupsKeyword]
  );

  const fetchGroups = async () => {
    setLoadingGroups(true);
    try {
      const page = await listEmailGroups(groupsQuery);
      setGroups(page.content ?? []);
      setGroupsTotal(page.totalElements ?? 0);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load groups." });
    } finally {
      setLoadingGroups(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupsQuery.page, groupsQuery.size, groupsQuery.keyword]);

  // ===== Members =====
  const fetchMembers = async () => {
    if (!activeGroup) return;
    setLoadingMembers(true);
    try {
      const page = await listEmailGroupMembers(activeGroup.id, {
        page: membersPage,
        size: membersSize,
        keyword: membersKeyword || undefined,
      });
      setMembers(page.content ?? []);
      setMembersTotal(page.totalElements ?? 0);
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to load group members." });
    } finally {
      setLoadingMembers(false);
    }
  };

  useEffect(() => {
    if (!openMembers) return;
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMembers, activeGroup?.id, membersPage, membersSize, membersKeyword]);

  // ===== Handlers =====
  const onClickCreate = () => {
    setEditingGroup(null);
    setOpenGroupDialog(true);
  };

  const onClickEdit = (g: EmailGroup) => {
    setEditingGroup(g);
    setOpenGroupDialog(true);
  };

  const onSubmitGroup = async (payload: { name: string; description?: string }) => {
    try {
      if (editingGroup) {
        await updateEmailGroup(editingGroup.id, payload);
        toast({ title: "Updated", description: "Group updated successfully." });
      } else {
        await createEmailGroup(payload);
        toast({ title: "Created", description: "Group created successfully." });
      }
      setOpenGroupDialog(false);
      setEditingGroup(null);
      fetchGroups();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message ?? "Failed to save group." });
    }
  };

  const onDeleteGroup = async (g: EmailGroup) => {
    try {
      await deleteEmailGroup(g.id);
      toast({ title: "Deleted", description: "Group deleted." });
      fetchGroups();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message ?? "Failed to delete group." });
    }
  };

  const onOpenMembers = (g: EmailGroup) => {
    setActiveGroup(g);
    setMembersPage(0);
    setMembersKeyword("");
    setOpenMembers(true);
  };

  const onAddMembers = async (payload: { emails?: string[]; userIds?: number[] }) => {
    if (!activeGroup) return;
    try {
      const res = await addEmailGroupMembers(activeGroup.id, payload);
      toast({
        title: "Members updated",
        description: `Added: ${res.added ?? 0}, Skipped: ${res.skipped ?? 0}`,
      });
      fetchMembers();
      fetchGroups(); // nếu backend trả memberCount
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message ?? "Failed to add members." });
    }
  };

  const onRemoveMember = async (memberId: number) => {
    if (!activeGroup) return;
    try {
      await removeEmailGroupMember(activeGroup.id, memberId);
      toast({ title: "Removed", description: "Member removed." });
      fetchMembers();
      fetchGroups();
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e?.message ?? "Failed to remove member." });
    }
  };

  return (
    <div className="space-y-6 p-6">
          <GroupsToolbar
            keyword={groupsKeyword}
            onKeywordChange={(v) => {
              setGroupsKeyword(v);
              setGroupsPage(0);
            }}
            onCreate={onClickCreate}
            onRefresh={fetchGroups}
            isRefreshing={loadingGroups}
          />

          <GroupsTable
            data={groups}
            loading={loadingGroups}
            page={groupsPage}
            size={groupsSize}
            total={groupsTotal}
            onPageChange={setGroupsPage}
            onSizeChange={(s) => {
              setGroupsSize(s);
              setGroupsPage(0);
            }}
            onEdit={onClickEdit}
            onDelete={onDeleteGroup}
            onManageMembers={onOpenMembers}
          />

      <GroupDialog
        open={openGroupDialog}
        onOpenChange={setOpenGroupDialog}
        mode={editingGroup ? "edit" : "create"}
        initial={editingGroup ? { name: editingGroup.name, description: editingGroup.description ?? "" } : undefined}
        onSubmit={onSubmitGroup}
      />

      <MembersDrawer
        open={openMembers}
        onOpenChange={setOpenMembers}
        group={activeGroup}
        members={members}
        loading={loadingMembers}
        page={membersPage}
        size={membersSize}
        total={membersTotal}
        keyword={membersKeyword}
        onKeywordChange={(v) => {
          setMembersKeyword(v);
          setMembersPage(0);
        }}
        onPageChange={setMembersPage}
        onSizeChange={(s) => {
          setMembersSize(s);
          setMembersPage(0);
        }}
        onAddMembers={onAddMembers}
        onRemoveMember={onRemoveMember}
        onRefresh={fetchMembers}
      />
    </div>
  );
}
