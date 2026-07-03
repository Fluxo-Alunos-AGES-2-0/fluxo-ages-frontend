export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

export interface BlobResponse {
  blob: Blob;
  filename: string | null;
}

/** Resolve uma URL de arquivo retornada pela API (relativa /uploads/... ou absoluta). */
export function resolveFileUrl(url: string): string {
  return /^https?:\/\//.test(url) ? url : `${BASE_URL}${url}`;
}

function handleUnauthorized() {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
}

function extractFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const plainMatch = contentDisposition.match(/filename="?(.*?)"?(?:;|$)/i);
  return plainMatch?.[1] ?? null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) ?? {}),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && token) {
    handleUnauthorized();
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => {
    const isFormData = body instanceof FormData;
    return request<T>(path, {
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  put: <T>(path: string, body: unknown) => {
    const isFormData = body instanceof FormData;
    return request<T>(path, {
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  patch: <T>(path: string, body: unknown) => {
    const isFormData = body instanceof FormData;
    return request<T>(path, {
      method: "PATCH",
      body: isFormData ? body : JSON.stringify(body),
    });
  },
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
  blob: async (path: string): Promise<BlobResponse> => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}${path}`, { headers });

    if (res.status === 401 && token) {
      handleUnauthorized();
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    return {
      blob: await res.blob(),
      filename: extractFilename(res.headers.get("Content-Disposition")),
    };
  },
};
