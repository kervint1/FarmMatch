import { apiCall } from "@/lib/utils/api-client";

export async function getReservations(
  skip?: number,
  limit?: number,
  guestId?: string,
  farmId?: string,
  status?: string
) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());
  if (guestId) params.append("guest_id", guestId);
  if (farmId) params.append("farm_id", farmId);
  if (status) params.append("status", status);

  const queryString = params.toString();
  const endpoint = `/api/reservations${queryString ? `?${queryString}` : ""}`;

  return apiCall<any[]>(endpoint);
}

export async function createReservation(data: {
  farm_id: string | number;
  guest_id: string | number;
  start_date: string;
  end_date: string;
  num_guests: number;
  total_amount: number;
  contact_phone: string;
  message?: string;
}) {
  const payload = {
    farm_id: parseInt(String(data.farm_id)),
    guest_id: parseInt(String(data.guest_id)),
    start_date: data.start_date,
    end_date: data.end_date,
    num_guests: parseInt(String(data.num_guests)),
    total_amount: Math.floor(parseFloat(String(data.total_amount))),
    contact_phone: data.contact_phone,
    message: data.message || null,
  };

  console.log("Creating reservation with payload:", payload);

  return apiCall<any>(`/api/reservations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateReservation(
  id: string,
  data: Record<string, any>
) {
  return apiCall<any>(`/api/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function getReservation(reservationId: string) {
  return apiCall<any>(`/api/reservations/${reservationId}`);
}

export async function cancelReservation(id: string) {
  return apiCall<any>(`/api/reservations/${id}/cancel`, {
    method: "POST",
  });
}

export async function getHostReservations(
  hostId: number,
  skip?: number,
  limit?: number,
  status?: string
) {
  const params = new URLSearchParams();
  if (skip !== undefined) params.append("skip", skip.toString());
  if (limit !== undefined) params.append("limit", limit.toString());
  if (status) params.append("status", status);

  const queryString = params.toString();
  const endpoint = `/api/reservations/host/${hostId}${queryString ? `?${queryString}` : ""}`;

  return apiCall<any[]>(endpoint);
}

export async function approveReservation(
  reservationId: number,
  hostId: number,
  approvalMessage?: string
) {
  return apiCall<any>(`/api/reservations/${reservationId}/approve`, {
    method: "POST",
    body: JSON.stringify({
      host_id: hostId,
      approval_message: approvalMessage || null,
    }),
  });
}
