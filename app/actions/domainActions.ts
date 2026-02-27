"use server";

import { OrganizerResponseDTO } from "@/types/organizer";
import { cookies } from "next/headers";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function fetchDomain(endpoint: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    return [];
  }
}

export async function getCategories() {
  return fetchDomain("/categories");
}
export async function getLocations() {
  return fetchDomain("/locations");
}
export async function getRequirements() {
  return fetchDomain("/requirements");
}
export async function getTags() {
  return fetchDomain("/tags");
}

export async function getOrganizers(): Promise<OrganizerResponseDTO[]> {
  return fetchDomain("/organizers");
}

export async function getSpeakers(): Promise<{ id: number; name: string }[]> {
  return fetchDomain("/speakers");
}

// TODO Enquanto o JWT não estiver pronto, essa vai ser a minha maior vigarice para pegar as ORGs do usuário logado.
export async function getUserOrganizers(): Promise<OrganizerResponseDTO[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return [];

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = Buffer.from(payloadBase64, "base64").toString(
      "utf-8",
    );
    const { id: userId, role } = JSON.parse(decodedPayload);

    const allOrgs = await getOrganizers();

    if (role === "ADMIN") {
      return allOrgs;
    }

    const orgsWithMembershipPromises = allOrgs.map(async (org) => {
      try {
        const resMembers = await fetch(
          `${API_URL}/organizers/${org.id}/members`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          },
        );

        if (!resMembers.ok) return null;

        const members: Array<{
          userId: string;
          name: string;
          email: string;
          joinedAt: string;
        }> = await resMembers.json();

        const isMember = members.some(
          (m) => String(m.userId) === String(userId),
        );

        return isMember ? org : null;
      } catch (error) {
        console.error(`Erro ao buscar membros da ORG ${org.id}:`, error);
        return null;
      }
    });

    const resolvedOrgs = await Promise.all(orgsWithMembershipPromises);
    return resolvedOrgs.filter(Boolean).filter((e) => e !== null);
  } catch (error) {
    console.error("Erro em getUserOrganizers:", error);
    return [];
  }
}
