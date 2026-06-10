import { api } from "./api";

export interface ReportUploadUrlResponse {
  uploadUrl: string;
  fileReference: string;
  method: string;
  contentType: string;
}

export interface ReportArchiveResponse {
  id: number;
  archiveUrl: string;
  createdAt: string;
}

export function createProgressReportUploadUrl() {
  return api.post<ReportUploadUrlResponse>(
    "/report/progress/upload-url",
    undefined,
  );
}

export function createFinalReportUploadUrl() {
  return api.post<ReportUploadUrlResponse>("/report/final/upload-url", undefined);
}

export async function uploadFileToPresignedUrl(
  uploadUrl: string,
  file: File,
  contentType: string,
) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao enviar arquivo para o armazenamento (${response.status}).`,
    );
  }
}

export function confirmProgressReportUpload(fileReference: string) {
  return api.post<ReportArchiveResponse>("/report/progress/confirm", {
    fileReference,
  });
}

export function confirmFinalReportUpload(fileReference: string) {
  return api.post<ReportArchiveResponse>("/report/final/confirm", {
    fileReference,
  });
}
