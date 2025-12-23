import type { PageResp } from "@/types/pagination";

export type SendReq = {
  to: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  templateName: string;
  model?: Record<string, any>;
  partials?: string[];
  attachmentUrls?: string[];
  generateReport?: boolean;
  reportKeyPrefix?: string;
};

export type EmailLog = {
  id: number;
  toEmail: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  templateName: string;
  status: 'SENT' | 'FAILED';
  errorMessage?: string | null;
  sentAt: string; // ISO
  metadataJson?: string | null;
};

export type EmailTemplateSchema = {
  fields: Array<{
    key: string;
    label?: string;
    type?: 'string'|'number'|'boolean'|'url'|'array[string]'|'array[number]'|'object'|'array[object]';
    required?: boolean;
    default?: any;
    help?: string;
  }>;
};

export type EmailGroup = {
  id: number;
  name: string;
  description?: string | null;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
  memberCount?: number;
};

export type EmailGroupMember = {
  id: number;   
  userId: number;
  email: string;
};

export type BroadcastGroupReq = {
  groupId: number;

  // vẫn cho phép cc/bcc nếu bạn cần
  cc?: string[];
  bcc?: string[];

  subject: string;
  templateName: string;
  model: Record<string, unknown>;

  partials?: string[];
  attachmentUrls?: string[];

  generateReport?: boolean;
  reportKeyPrefix?: string;

  // tối ưu enqueue theo batch
  batchSize?: number;     // ví dụ 500
  rateLimitPerSecond?: number; // ví dụ 20 (nếu backend support)
};
