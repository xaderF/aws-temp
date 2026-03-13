const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  try {
    const text = await res.text();
    if (!text) return {};
    return JSON.parse(text);
  } catch {
    return {};
  }
}

async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const method = options?.method ?? "GET";
  const hasBody = options?.body != null;
  const headers: Record<string, string> = {
    ...getAuthHeader(),
    ...(options?.headers as Record<string, string>),
  };
  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("auth:logout"));
  }
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const err = data as { detail?: string | { msg?: string; loc?: unknown[] }[] };
    let msg = res.statusText;
    if (typeof err.detail === "string") {
      msg = err.detail;
    } else if (Array.isArray(err.detail) && err.detail.length > 0) {
      const first = err.detail[0];
      msg = typeof first === "object" && first?.msg ? String(first.msg) : String(first ?? msg);
    }
    throw new Error(msg);
  }
  return data as T;
}

export interface Route {
  id: string;
  name: string;
  campus: string;
  color: string | null;
}

export interface RouteStop {
  route_id: string;
  stop_order: number;
  stop: { id: string; name: string; lat: number; lng: number };
}

export interface Trip {
  id: string;
  user_id: string;
  route_id: string;
  start_stop_id: string;
  end_stop_id: string | null;
  started_at: string;
  ended_at: string | null;
  status: string;
  fare_cents: number | null;
}

export interface User {
  id: string;
  email: string;
  student_id: string | null;
  utorid: string | null;
  is_student: boolean;
  full_name: string | null;
  created_at: string;
}

export type TicketType = "SHUTTLE_SINGLE" | "SHUTTLE_DAY" | "GUEST";
export type TicketStatus = "ACTIVE" | "USED" | "EXPIRED" | "REFUNDED";

export interface Ticket {
  id: string;
  user_id: string;
  type: TicketType;
  status: TicketStatus;
  qr_code: string;
  purchased_at: string;
  expires_at: string | null;
}

export const api = {
  getRoutes: () => fetchApi<Route[]>("/api/v1/routes"),
  getRouteStops: (routeId: string) => fetchApi<RouteStop[]>(`/api/v1/routes/${routeId}/stops`),
  getTripHistory: (limit = 20) => fetchApi<Trip[]>(`/api/v1/trips/history?limit=${limit}`),
  getCurrentUser: () => fetchApi<User>("/api/v1/auth/me"),
  getMyTickets: () => fetchApi<Ticket[]>("/api/v1/tickets"),
  purchaseTicket: (type: TicketType) =>
    fetchApi<Ticket>(`/api/v1/tickets/purchase?type=${encodeURIComponent(type)}`, {
      method: "POST",
    }),
  deleteTicket: (ticketId: string) =>
    fetchApi<void>(`/api/v1/tickets/${encodeURIComponent(ticketId)}`, {
      method: "DELETE",
    }),
};
