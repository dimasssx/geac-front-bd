import { EventRequestDTO } from "@/types/event";
import { getCookie } from "cookies-next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

/**
 * Serviço client-safe — pode ser importado em Client Components ("use client").
 * NÃO usa next/headers.
 */
export const eventClientService = {
  createEvent: async (eventData: EventRequestDTO): Promise<void> => {
    const token = getCookie("token");

    if (!token) throw new Error("Não autorizado");

    const res = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(eventData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erro ao criar evento");
    }

    return res.json();
  },
};
