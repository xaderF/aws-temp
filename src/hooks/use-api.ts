import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type TicketType, type User } from "@/lib/api";

export function useRoutes() {
  return useQuery({
    queryKey: ["routes"],
    queryFn: () => api.getRoutes(),
  });
}

export function useRouteStops(routeId: string | null) {
  return useQuery({
    queryKey: ["routes", routeId, "stops"],
    queryFn: () => api.getRouteStops(routeId!),
    enabled: !!routeId,
  });
}

export function useTripHistory(user: User | null) {
  return useQuery({
    queryKey: ["trips", user?.id],
    queryFn: () => api.getTripHistory(),
    enabled: !!user,
  });
}

function isTokenValid(): boolean {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function useCurrentUser() {
  const hasValidToken = isTokenValid();
  return useQuery({
    queryKey: ["me", hasValidToken],
    queryFn: () => api.getCurrentUser(),
    enabled: hasValidToken,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMyTickets(user: User | null) {
  return useQuery({
    queryKey: ["tickets", user?.id],
    queryFn: () => api.getMyTickets(),
    enabled: !!user,
  });
}

export function usePurchaseTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: TicketType) => api.purchaseTicket(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useDeleteTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => api.deleteTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useDeleteTickets() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ticketIds: string[]) => {
      await Promise.all(ticketIds.map((ticketId) => api.deleteTicket(ticketId)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
