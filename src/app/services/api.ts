const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081";

function handleUnauthorized() {
  localStorage.removeItem("token");
  if (window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
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
};
