"use server";

import { cookies } from "next/headers";
import { SignInData, AuthResponse } from "@/types/auth";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function loginAction(formData: SignInData) {
  let data: AuthResponse;

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.message || "Credenciais inválidas." };
    }

    data = await response.json();

    const cookieStore = await cookies();

    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return { error: "Servidor indisponível. Tente novamente mais tarde." };
  }

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/signin");
}
