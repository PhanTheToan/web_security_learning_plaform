"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  getEmailTemplateSchema,
  previewAdminEmail,
  sendAdminEmail,
  sendAdminEmailAsync,

  // new
  listEmailGroups,
  broadcastGroupAsync,
} from "@/lib/api"
import type { EmailTemplateSchema, SendReq, EmailGroup, BroadcastGroupReq } from "@/types/email"
import { set, get, isEmpty } from "lodash"
import { ArrayInput } from "./shared/array-input"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface SendFormProps {
  setPreviewContent: (content: string) => void
}

export function SendForm({ setPreviewContent }: SendFormProps) {
  const [templates] = useState(["welcome", "report", "async-all"])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [schema, setSchema] = useState<EmailTemplateSchema | null>(null)
  const [formData, setFormData] = useState<Partial<SendReq>>({
    attachmentUrls: [],
    generateReport: false,
  })
  const [model, setModel] = useState<Record<string, unknown>>({})
  const [isLoadingSchema, setIsLoadingSchema] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [action, setAction] = useState<"preview" | "send" | "sendAsync" | null>(null)

  const [recipientMode, setRecipientMode] = useState<"manual" | "group">("manual");
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoadingGroups(true);
      try {
        const page = await listEmailGroups({ page: 0, size: 200 });
        setGroups(page.content || []);
      } catch (e) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load email groups.",
        });
      } finally {
        setIsLoadingGroups(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedTemplate) {
      setSchema(null)
      setModel({})
      return
    }

    const fetchSchema = async () => {
      setIsLoadingSchema(true)
      try {
        const result = await getEmailTemplateSchema(selectedTemplate)
        setSchema(result)
        const initialModel: Record<string, unknown> = {}
        let initialSubject = ""
        result?.fields.forEach((field) => {
          if (field.default) {
            set(initialModel, field.key, field.default)
            if (field.key === "subject") {
              initialSubject = field.default
            }
          }
        })
        setModel(initialModel)
        setFormData((prev) => ({
          ...prev,
          subject: initialSubject || prev.subject,
        }))
      } catch (error) {
        console.error("Failed to fetch schema", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not fetch template schema.",
        })
      } finally {
        setIsLoadingSchema(false)
      }
    }

    fetchSchema()
  }, [selectedTemplate])

  const handleModelChange = (key: string, value: unknown) => {
    const newModel = { ...model }
    set(newModel, key, value)
    setModel(newModel)
  }

  const handlePreview = async () => {
    setIsSubmitting(true)
    setAction("preview")
    try {
      const payload: Partial<SendReq> = {
        ...formData,
        templateName: selectedTemplate,
        model,
      }
      const html = await previewAdminEmail(payload)
      setPreviewContent(html)
      toast({ title: "Success", description: "Preview updated." })
    } catch (error) {
      console.error("Failed to fetch preview", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch preview.",
      })
    } finally {
      setIsSubmitting(false)
      setAction(null)
    }
  }

  const handleSend = async (isAsync: boolean) => {
    setIsSubmitting(true);
    setAction(isAsync ? "sendAsync" : "send");

    try {
      if (!selectedTemplate) throw new Error("Template is required.");
      if (!formData.subject) throw new Error("Subject is required.");

      // Mode = GROUP: bắt buộc async (vì 10k+)
      if (recipientMode === "group") {
        if (!selectedGroupId) throw new Error("Please select an email group.");

        const payload: BroadcastGroupReq = {
          groupId: selectedGroupId,
          subject: formData.subject!,
          templateName: selectedTemplate,
          model,
          partials: formData.partials,
          attachmentUrls: formData.attachmentUrls,
          generateReport: formData.generateReport,
          reportKeyPrefix: formData.reportKeyPrefix,

          // gợi ý tối ưu
          batchSize: 500,
          rateLimitPerSecond: 20,
        };

        await broadcastGroupAsync(payload);

        toast({
          title: "Success",
          description: "Broadcast queued. Backend will process members in batches.",
        });
        return;
      }

      // Mode = MANUAL: giữ như cũ
      const payload = {
        to: formData.to!,
        cc: formData.cc,
        bcc: formData.bcc,
        subject: formData.subject!,
        templateName: selectedTemplate,
        model,
        attachmentUrls: formData.attachmentUrls,
        generateReport: formData.generateReport,
        reportKeyPrefix: formData.reportKeyPrefix,
      };

      const sendAction = isAsync ? sendAdminEmailAsync : sendAdminEmail;
      await sendAction(payload as any);

      toast({
        title: "Success",
        description: isAsync ? "Email queued for sending." : "Email sent.",
      });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      toast({ variant: "destructive", title: "Error", description: msg });
    } finally {
      setIsSubmitting(false);
      setAction(null);
    }
  };

  const renderField = (field: EmailTemplateSchema["fields"][0]) => {
    const value = get(model, field.key)
    const commonProps = {
      id: field.key,
      required: field.required,
      placeholder: field.label,
      className: "bg-transparent border-[#ffffff]/20 focus:border-[#9747ff] focus:ring-[#9747ff] text-white",
    }

    switch (field.type) {
      case "array[string]":
        return (
          <ArrayInput
            value={Array.isArray(value) ? value : []}
            onChange={(val) => handleModelChange(field.key, val)}
            placeholder={`Enter a ${field.label}`}
          />
        )
      case "url":
        return (
          <Input
            {...commonProps}
            type="url"
            value={typeof value === 'string' ? value : ""}
            onChange={(e) => handleModelChange(field.key, e.target.value)}
          />
        )
      case "string":
      default:
        return (
          <Input
            {...commonProps}
            value={typeof value === 'string' ? value : ""}
            onChange={(e) => handleModelChange(field.key, e.target.value)}
          />
        )
    }
  }

  const canSubmit =
    !!selectedTemplate &&
    !!formData.subject &&
    (recipientMode === "group"
      ? !!selectedGroupId
      : !!formData.to && formData.to.length > 0);
  const isLoading = isLoadingSchema || isSubmitting

  const cardClassName = "bg-transparent border-none shadow-none"
  const inputClassName = "bg-transparent border-[#ffffff]/20 focus:border-[#9747ff] focus:ring-[#9747ff] text-white"
  const labelClassName = "text-gray-300"

  return (
    <div className="space-y-6">
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-white">Recipients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className={labelClassName}>Send Mode</Label>
            <Select value={recipientMode} onValueChange={(v) => setRecipientMode(v as any)}>
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual (To/CC/BCC)</SelectItem>
                <SelectItem value="group">Broadcast group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientMode === "group" && (
            <div className="space-y-2">
              <Label className={labelClassName}>Email Group</Label>
              <Select
                value={selectedGroupId ? String(selectedGroupId) : ""}
                onValueChange={(v) => setSelectedGroupId(Number(v))}
                disabled={isLoadingGroups}
              >
                <SelectTrigger className={inputClassName}>
                  <SelectValue placeholder={isLoadingGroups ? "Loading groups..." : "Select a group"} />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name} {typeof g.memberCount === "number" ? `(${g.memberCount})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-xs text-gray-400">
                Broadcast sẽ enqueue theo batch ở backend (phù hợp gửi 10k+).
              </p>
            </div>
          )}

          {recipientMode === "manual" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="to" className={labelClassName}>To <span className="text-red-500">*</span></Label>
                <Input id="to" placeholder="recipient@example.com" required value={formData.to || ""} onChange={(e) => setFormData({ ...formData, to: e.target.value })} className={inputClassName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc" className={labelClassName}>CC</Label>
                <Input id="cc" placeholder="cc@example.com" value={formData.cc || ""} onChange={(e) => setFormData({ ...formData, cc: e.target.value })} className={inputClassName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bcc" className={labelClassName}>BCC</Label>
                <Input id="bcc" placeholder="bcc@example.com" value={formData.bcc || ""} onChange={(e) => setFormData({ ...formData, bcc: e.g.target.value })} className={inputClassName} />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-xl text-white">Email Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject" className={labelClassName}>Subject <span className="text-red-500">*</span></Label>
            <Input id="subject" placeholder="Your email subject" required value={formData.subject || ""} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className={inputClassName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="templateName" className={labelClassName}>Template <span className="text-red-500">*</span></Label>
            <Select name="templateName" onValueChange={setSelectedTemplate} value={selectedTemplate}>
              <SelectTrigger id="templateName" className={inputClassName}>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent >
                {templates.map((template) => (
                  <SelectItem key={template} value={template} className="hover:bg-[#9747ff]/20 focus:bg-[#9747ff]/20">
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <>
          <Card className={cardClassName}>
            <CardHeader>
              <CardTitle className="text-xl text-white">Template Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingSchema && <p className="text-gray-400">Loading schema...</p>}
              {schema ? (
                schema.fields.map((field) =>
                  field.key !== "subject" ? (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key} className={labelClassName}>
                        {field.label || field.key}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      {renderField(field)}
                    </div>
                  ) : null
                )
              ) : !isLoadingSchema ? (
                <p className="text-sm text-gray-400">No schema defined for this template.</p>
              ) : null}
            </CardContent>
          </Card>

          <Card className={cardClassName}>
            <CardHeader>
              <CardTitle className="text-xl text-white">Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <ArrayInput
                value={formData.attachmentUrls || []}
                onChange={(urls) => setFormData({ ...formData, attachmentUrls: urls })}
                placeholder="https://example.com/file.pdf"
                label="Attachment URL"
              />
            </CardContent>
          </Card>

          <Card className={cardClassName}>
            <CardHeader>
              <CardTitle className="text-xl text-white">Report Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="generateReport"
                  checked={formData.generateReport}
                  onCheckedChange={(checked) => setFormData({ ...formData, generateReport: !!checked })}
                  className="border-gray-500 data-[state=checked]:bg-[#9747ff] data-[state=checked]:border-[#9747ff]"
                />
                <Label htmlFor="generateReport" className={labelClassName}>Generate Report (PDF)</Label>
              </div>
              {formData.generateReport && (
                <div className="space-y-2">
                  <Label htmlFor="reportKeyPrefix" className={labelClassName}>Report Key Prefix</Label>
                  <Input
                    id="reportKeyPrefix"
                    placeholder="e.g., reports/user123/"
                    value={formData.reportKeyPrefix || ""}
                    onChange={(e) => setFormData({ ...formData, reportKeyPrefix: e.target.value })}
                    className={inputClassName}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {!isEmpty(model) && (
            <Card className={cardClassName}>
              <CardHeader>
                <CardTitle className="text-xl text-white">Model Preview (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="p-4 bg-black/20 rounded-md text-sm overflow-x-auto text-gray-300 border border-white/10">
                  <code>{JSON.stringify(model, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <div className="flex justify-end space-x-2 sticky bottom-4 py-2">
        <Button variant="outline" type="button" onClick={handlePreview} disabled={isLoading || !canSubmit} className="bg-transparent border-[#9747ff]/50 text-white hover:bg-[#9747ff]/20 hover:text-white">
          {isLoading && action === "preview" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Preview
        </Button>
        <Button type="button" onClick={() => handleSend(false)} disabled={isLoading || !canSubmit} className="bg-gradient-to-r from-[#9747ff] to-[#5a5bed] text-white hover:opacity-90 shadow-[0_0_15px_rgba(151,71,255,0.4)]">
          {isLoading && action === "send" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send
        </Button>
        <Button type="button" onClick={() => handleSend(true)} disabled={isLoading || !canSubmit} className="bg-gradient-to-r from-[#821db6] to-[#5a5bed] text-white hover:opacity-90 shadow-[0_0_15px_rgba(151,71,255,0.4)]">
          {isLoading && action === "sendAsync" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Send (Async)
        </Button>
      </div>
    </div>
  )
}
