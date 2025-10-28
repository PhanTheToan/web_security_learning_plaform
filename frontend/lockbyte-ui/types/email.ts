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

export type PageResp<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page
  size: number;
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
