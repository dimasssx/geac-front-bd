import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/types/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const decoded: CustomJwtPayload = jwtDecode(token);

    const user = {
      name: decoded.name,
      email: decoded.sub,
      role: decoded.role,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
