import { SignJWT, jwtVerify } from "jose";
import { Role } from "@/generated/prisma/enums";

export const SESSION_COOKIE_NAME = "focus_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 Stunden

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET fehlt in den Umgebungsvariablen.");
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  code: string;
  role: Role;
};

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const { sub, code, role } = payload;

    if (
      typeof sub === "string" &&
      typeof code === "string" &&
      (role === Role.PARTICIPANT || role === Role.ADMIN)
    ) {
      return { sub, code, role };
    }
    return null;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}
