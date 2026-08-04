import { NextResponse, type NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  createSessionToken,
  sessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/session";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { code, password } = (body ?? {}) as {
    code?: unknown;
    password?: unknown;
  };

  if (
    typeof code !== "string" ||
    typeof password !== "string" ||
    !code.trim() ||
    !password
  ) {
    return NextResponse.json(
      { error: "Code und Passwort erforderlich." },
      { status: 400 }
    );
  }

  const participant = await prisma.participant.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  const passwordValid = participant
    ? await bcrypt.compare(password, participant.passwordHash)
    : false;

  if (!participant || !passwordValid) {
    return NextResponse.json(
      { error: "Code oder Passwort falsch." },
      { status: 401 }
    );
  }

  const token = await createSessionToken({
    sub: participant.id,
    code: participant.code,
    role: participant.role,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
  return response;
}
