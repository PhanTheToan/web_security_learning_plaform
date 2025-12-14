
import { EmailTemplateSchema, SendReq, EmailLog, EmailGroup, EmailGroupMember, BroadcastGroupReq } from "@/types/email";
import type { EmailJob, EmailJobStatus, PageResp } from "@/types/email-jobs";



const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082/api";



async function buildHeaders(extra?: HeadersInit): Promise<Headers> {



  const h = new Headers(extra ?? {});



  if (!h.has("Content-Type")) h.set("Content-Type", "application/json");







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

    throw new Error(raw || `Request failed: ${resp.status}`);

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

export type Tag = { id: number; name: string };



export type TopicDetail = {

  id: number;

  title: string;

  content: string;

  status: "Draft" | "Published";

  labs: Lab[];

  tags: Tag[];

};



export type LabListItem = {

  id: number;

  name: string;

  tags: Tag[];

  estatus: "Published" | "Draft";

};



export type LabsApiResponse = {

  headers: object;

  body: LabListItem[];

  statusCode: string;

  statusCodeValue: number;

};







export type CommunitySolution = {



  id: number;



  status: string;



  writeup: string;



  youtubeUrl: string;



  labId: number;



  userId: number;



  fullName: string;



};







export type LabDetail = {



  id: number;



  name: string;



  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";



  dockerImage: string | null;



  status: "Published" | "Draft";



  authorName: string;



  tags: Tag[];



  description: string;



  hint: string;



  solution: string;



  fixVulnerabilities: string;



  timeoutMinutes: number;



  linkSource: string | null;



  communitySolutionDTOS: CommunitySolution[];



};







export type UserProfile = {



  username: string;



  email: string;



  fullName: string;



  role: string;



  dateOfBirth?: string;



  gender?: 'MALE' | 'FEMALE' | 'OTHER';



};







export type ChangePasswordPayload = {



  oldPassword?: string;



  newPassword?: string;



};







export type UpsertTopicPayload = {







  title: string;







  content: string;







  status: "Draft" | "Published" | "Archived";







  labsId: number[];







  tagId: number[];







  coverImage?: string;







};







export function getPublicLabs() {



  return fetchWithCredentials<LabsApiResponse>("/lab");



}







export function filterPublicLabs(name?: string, tagIds?: number[]) {



  const params = new URLSearchParams();



  if (name) params.set("name", name);



  if (tagIds?.length) params.set("tagIds", tagIds.join(","));



  return fetchWithCredentials<LabListItem[]>(`/lab/filter?${params}`);



}







export function getPublicLabById(id: string | number) {



  return fetchWithCredentials<LabDetail>(`/lab/${id}`);



}







export function getUserProfile() {



  return fetchWithCredentials<UserProfile>("/user/profile");



}







export function updateUserProfile(payload: Partial<UserProfile>) {



  // This function is now for personal info only



  return fetchWithCredentials<UserProfile>("/user/profile", {



    method: "PATCH", // Changed to PATCH for partial updates



    body: JSON.stringify(payload),



  });



}







export function changePassword(payload: ChangePasswordPayload) {



  // New function specifically for changing the password



  return fetchWithCredentials<string>("/user/profile/change-password", {



    method: "POST",



    body: JSON.stringify(payload),



  });



}

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



export function getPublicTags() {

  return fetchWithCredentials<Tag[]>("/public/tags");

}



export function searchAdminTags(name: string) {

  const params = new URLSearchParams({ type: "tag", name, like: "true" });

  return fetchWithCredentials<{ items: Tag[] }>(`/admin/search?${params}`);

}



export function searchAdminLabs(name: string) {

  const params = new URLSearchParams({ type: "lab", name, like: "true" });

  return fetchWithCredentials<{ items: Lab[] }>(`/admin/search?${params}`);

}



// ================== Email Module APIs ==================



// This is a mock function. In a real app, it would fetch a schema from a remote source.



export async function getEmailTemplateSchema(



  templateName: string



): Promise<EmailTemplateSchema | null> {



    const schemas: Record<string, EmailTemplateSchema> = {



  



      welcome: {



  



        fields: [



  



          { key: "subject", label: "Email Subject", type: "string", required: true, default: "🎉 Welcome to Lockbyte" },



  



          { key: "user.fullName", label: "Full Name", type: "string", required: true },



  



          { key: "activationCode", label: "Activation Code", type: "string", required: true },



  



          { key: "actionUrl", label: "Action URL", type: "url", required: true },



  



          { key: "features", label: "Features", type: "array[string]" },



  



          { key: "reportUrl", label: "Report URL (optional)", type: "url", required: false }



  



        ]



  



      },



  



      report: {



  



        fields: [



  



          { key: "subject", label: "Email Subject", type: "string", required: true, default: "Your Monthly Report is Ready" },



  



          { key: "user.fullName", label: "Full Name", type: "string", required: true },



  



          { key: "report.name", label: "Report Name", type: "string", required: true },



  



          { key: "report.period", label: "Report Period", type: "string", required: true },



  



          { key: "report.downloadUrl", label: "Download URL", type: "url", required: true }



  



        ]



  



      },



  



      "async-all": {



        fields: [



          { key: "subject", label: "Email Subject", type: "string", required: true, default: "🔔 CyberLock – Thông báo mới" },



          { key: "title", label: "Tiêu đề chính", type: "string", required: true },



          { key: "description", label: "Mô tả", type: "string", required: true },



          { key: "imageUrl", label: "URL ảnh minh họa (optional)", type: "url", required: false },



          { key: "ctaUrl", label: "URL hành động (optional)", type: "url", required: false },



          { key: "ctaText", label: "Text nút hành động (optional)", type: "string", required: false },



        ]



      },



  



    };







  return Promise.resolve(schemas[templateName] || null);



}



export function previewAdminEmail(payload: Partial<SendReq>) {

  return fetchWithCredentials<string>("/admin/email/preview", {

    method: "POST",

    body: JSON.stringify(payload),

    extraHeaders: {

      "Content-Type": "application/json",

      "Accept": "text/html"

    }

  });

}



export function sendAdminEmail(payload: SendReq) {



  return fetchWithCredentials<string>("/admin/email/send", {



    method: "POST",



    body: JSON.stringify(payload)



  });



}







export function sendAdminEmailAsync(payload: SendReq) {



  return fetchWithCredentials<string>("/admin/email/send-async", {



    method: "POST",



    body: JSON.stringify(payload)



  });



}



export function getAdminEmailLogs(







  params: { page?: number; size?: number; keyword?: string; status?: string }







) {







  const query = new URLSearchParams();







  if (params.page) query.set("page", params.page.toString());







  if (params.size) query.set("size", params.size.toString());







  if (params.keyword) query.set("keyword", params.keyword);







  if (params.status) query.set("status", params.status);







  return fetchWithCredentials<PageResp<EmailLog>>(`/admin/email/logs?${query}`);







}







// ================== Email Group APIs ==================







export function listEmailGroups(params?: { page?: number; size?: number; keyword?: string }) {



  const query = new URLSearchParams();



  if (params?.page !== undefined) query.set("page", String(params.page));



  if (params?.size !== undefined) query.set("size", String(params.size));



  if (params?.keyword) query.set("keyword", params.keyword);



  return fetchWithCredentials<PageResp<EmailGroup>>(`/admin/email/groups?${query.toString()}`);



}







export function createEmailGroup(payload: { name: string; description?: string }) {



  return fetchWithCredentials<EmailGroup>(`/admin/email/groups`, {



    method: "POST",



    body: JSON.stringify(payload),



  });



}







export function updateEmailGroup(groupId: number, payload: { name?: string; description?: string; status?: "ACTIVE" | "INACTIVE" }) {



  return fetchWithCredentials<EmailGroup>(`/admin/email/groups/${groupId}`, {



    method: "PUT",



    body: JSON.stringify(payload),



  });



}







export function deleteEmailGroup(groupId: number) {



  return fetchWithCredentials<void>(`/admin/email/groups/${groupId}`, { method: "DELETE" });



}







export function listEmailGroupMembers(groupId: number, params?: { page?: number; size?: number; keyword?: string }) {
  const query = new URLSearchParams();
  if (params?.page !== undefined) query.set("page", String(params.page));
  if (params?.size !== undefined) query.set("size", String(params.size));
  if (params?.keyword) query.set("keyword", params.keyword);

  return fetchWithCredentials<PageResp<[number, string]>>(
  `/admin/email/groups/${groupId}/members?${query.toString()}`
).then((pageResp) => {
  const members: EmailGroupMember[] = (pageResp.content ?? []).map(([userId, email]) => ({
    id: userId,
    userId,
    email,
  }));
  return { ...pageResp, content: members };
});

}








export function addEmailGroupMembers(groupId: number, payload: { emails?: string[]; userIds?: number[] }) {



  return fetchWithCredentials<{ added: number; skipped: number }>(`/admin/email/groups/${groupId}/members`, {



    method: "POST",



    body: JSON.stringify(payload),



  });



}







export function removeEmailGroupMembers(groupId: number, payload: { userIds: number[] }) {
  return fetchWithCredentials<{ removed: number }>(`/admin/email/groups/${groupId}/members`, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
}






/**



 * Broadcast group (async): server sẽ phân trang members + enqueue EmailEvent từng batch



 * (đúng với hướng tối ưu bạn đang theo).



 */



export function broadcastGroupAsync(payload: BroadcastGroupReq) {



  return fetchWithCredentials<string>(`/admin/email/broadcast-group`, {



    method: "POST",



    body: JSON.stringify(payload),



  });



}







// (Tuỳ chọn) Resend theo logId nếu backend có endpoint



export function resendEmailByLogId(logId: number) {



  return fetchWithCredentials<string>(`/admin/email/logs/${logId}/resend`, {



    method: "POST",



  });



}

export function getLabSessionStatus(labId?: string | number | null) {
  const id = typeof labId === "string" ? labId.trim() : labId;
  if (id === undefined || id === null || id === "") return Promise.resolve(null);

  return fetchWithCredentials<string>(
    `/lab-session/user-sessions?labId=${encodeURIComponent(String(id))}`
  );
}

export type StartLabSessionResponse = {
  id: number;
  message: string;
  containerId: string;
  url: string;
  port: number;
  expiresAt: string;
};


export function startLabSession(labId: string | number) {
  return fetchWithCredentials<StartLabSessionResponse>(`/lab-session/active?labId=${labId}`, {
    method: "POST",
  });
}

export function submitLabFlag(labId: string | number, labSessionId: number, flag: string) {
  return fetchWithCredentials<string>(`/lab-session/submit?labId=${labId}&labSessionId=${labSessionId}`, {
    method: "POST",
    body: flag,
    extraHeaders: {
      "Content-Type": "text/plain",
    },
  });
}

export function submitCommunitySolution(labId: string | number, youtubeLink: string, writeUpLink: string) {
  return fetchWithCredentials<void>(
    `/lab/community-solutions?${new URLSearchParams({
      labId: labId.toString(),
      youtubeLink,
      writeUpLink,
    })}`,
    {
      method: "POST",
    }
  );

}


export const api = {
  get: <T>(path: string, init?: RequestInit & { extraHeaders?: HeadersInit }) => fetchWithCredentials<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body: unknown, init?: RequestInit & { extraHeaders?: HeadersInit }) => fetchWithCredentials<T>(path, { ...init, method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown, init?: RequestInit & { extraHeaders?: HeadersInit }) => fetchWithCredentials<T>(path, { ...init, method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown, init?: RequestInit & { extraHeaders?: HeadersInit }) => fetchWithCredentials<T>(path, { ...init, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string, init?: RequestInit & { extraHeaders?: HeadersInit }) => fetchWithCredentials<T>(path, { ...init, method: "DELETE" }),
};

export function listEmailJobs(params: {
  page?: number;
  size?: number;
  status?: EmailJobStatus;
  groupId?: number;
}) {
  const query = new URLSearchParams();

  // lưu ý: phải check undefined, vì page=0 là hợp lệ
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  if (params.status) query.set("status", params.status);
  if (params.groupId !== undefined) query.set("groupId", String(params.groupId));

  return fetchWithCredentials<PageResp<EmailJob>>(`/admin/email/jobs?${query.toString()}`, {
    method: "GET",
  });
}

export function getEmailJob(jobId: string) {
  return fetchWithCredentials<EmailJob>(`/admin/email/jobs/${encodeURIComponent(jobId)}`, {
    method: "GET",
  });
}

export function pauseEmailJob(jobId: string) {
  return fetchWithCredentials<void>(`/admin/email/jobs/${encodeURIComponent(jobId)}/pause`, {
    method: "POST",
  });
}

export function resumeEmailJob(jobId: string) {
  return fetchWithCredentials<void>(`/admin/email/jobs/${encodeURIComponent(jobId)}/resume`, {
    method: "POST",
  });
}

export function cancelEmailJob(jobId: string) {
  return fetchWithCredentials<void>(`/admin/email/jobs/${encodeURIComponent(jobId)}/cancel`, {
    method: "POST",
  });
}


