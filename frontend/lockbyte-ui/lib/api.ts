
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082/api";

async function buildHeaders(extra?: HeadersInit): Promise<Headers> {
  const h = new Headers(extra ?? {});
  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");

  // Khi chạy trên server (Next App Router), tự attach Cookie của user vào request backend.
  if (typeof window === "undefined" && !h.has("Cookie")) {
    const cookieHeader = cookieStore.toString(); // "a=b; c=d"
    if (cookieHeader) h.set("Cookie", cookieHeader);
  }
  return h;
}

async function fetchWithCredentials<T>(
  path: string,
  init?: RequestInit & { extraHeaders?: HeadersInit }
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = await buildHeaders(init?.extraHeaders);
  const isBrowser = typeof window !== "undefined";

  const resp = await fetch(url, {
    method: init?.method ?? "GET",
    headers,
    body: init?.body,
    cache: "no-store",
    credentials: isBrowser ? "include" : undefined, // client mới sử dụng được
  });

  const raw = await resp.text();
  if (!resp.ok) {
    console.error(`API Error: ${resp.status} ${resp.statusText}`, raw);
    throw new Error(`Request failed: ${resp.status}`);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

/** ================== Types ================== **/
export type TopicListItem = {
  id: number;
  title: string;
  status: string;
  authorName: string;
};

export type TopicsApiResponse = {
  content: TopicListItem[];
  pageable: unknown;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: unknown;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
};

export type Lab = { id: number; name: string; estatus: string };

export type TopicDetail = {
  id: number;
  title: string;
  content: string;
  status: "Draft" | "Published";
  labs: Lab[];
};

export type UpsertTopicPayload = {
  title: string;
  content: string;
  status: "Draft" | "Published" | "Archived";
  labsId: number[];
};

/** ================== APIs ================== **/
export function getAdminTopics() {
  return fetchWithCredentials<TopicsApiResponse>("/admin/topics");
}

export function getAdminTopicById(id: string | number) {
  return fetchWithCredentials<TopicDetail>(`/admin/topics/${id}`);
}

export function getAdminLabs() {
  return fetchWithCredentials<Lab[]>("/admin/labs");
}

export function createAdminTopic(payload: UpsertTopicPayload) {
  return fetchWithCredentials<string>("/admin/topics", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAdminTopic(id: string | number, payload: UpsertTopicPayload) {
  return fetchWithCredentials<string>(`/admin/topics/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}