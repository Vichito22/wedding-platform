import { apiFetch } from "@/app/utils/api";

export interface SessionResponse {
  authenticated: boolean;
  email: string | null;
}

interface LoginRequest {
  email: string;
  password: string;
}

export async function loginAdmin(payload: LoginRequest): Promise<void> {
  await apiFetch<{ message: string }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function logoutAdmin(): Promise<void> {
  await apiFetch<{ message: string }>("/admin/auth/logout", {
    method: "POST",
  });
}

export async function getAdminSession(): Promise<SessionResponse> {
  return apiFetch<SessionResponse>("/admin/auth/session", {
    method: "GET",
  });
}
