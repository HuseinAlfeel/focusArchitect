import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // API-Routen prüfen ihre Anmeldung selbst und antworten mit 401 statt
  // Redirect, damit fetch()-Aufrufe kein HTML statt JSON zurückbekommen.
  matcher: ["/((?!login|api|_next/static|_next/image|favicon.ico).*)"],
};
