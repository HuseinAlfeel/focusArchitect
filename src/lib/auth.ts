import { cookies } from "next/headers";
import { Role } from "@/generated/prisma/enums";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function getCurrentParticipant() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAdmin() {
  const participant = await getCurrentParticipant();
  return participant?.role === Role.ADMIN ? participant : null;
}
