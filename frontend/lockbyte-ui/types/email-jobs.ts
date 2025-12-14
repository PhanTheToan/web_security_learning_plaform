export type EmailJobStatus =
  | "QUEUED"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type EmailJob = {
  id: string;
  groupId: number | null;
  templateName: string | null;
  subject: string | null;
  status: EmailJobStatus;

  total: number;
  sent: number;
  failed: number;

  createdAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;

  lastError?: string | null;
};

export type PageResp<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};
