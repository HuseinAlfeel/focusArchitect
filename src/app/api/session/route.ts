import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const clientAtRaw = (body as { clientAt?: unknown } | null)?.clientAt;
  const clientAt =
    typeof clientAtRaw === "string" && !Number.isNaN(Date.parse(clientAtRaw))
      ? new Date(clientAtRaw)
      : new Date();

  // Eine Person, eine Sitzung: gibt es schon eine, wird sie zurueckgegeben
  // statt eine zweite anzulegen. Ohne diese Pruefung legte jeder erneute
  // Aufruf eine weitere, leere Sitzung an - per Zurueck-Taste auf die
  // Einwilligungsseite, Reload oder Doppelklick. Weil alle Seiten mit
  // `orderBy: createdAt desc` die *neueste* Sitzung nehmen, waeren
  // Vorbefragung, Ereignisse und Kurzfeedback der ersten Sitzung damit fuer
  // die App unsichtbar geworden und die Person haette von vorn angefangen -
  // die Nachbefragung waere an der leeren Sitzung gelandet. Geloescht wurde
  // dabei nie etwas, aber im Export haette diese Person als zwei kaputte
  // Haelften gestanden. Gefunden bei der Datenverlust-Pruefung am 18.09.
  const existing = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  if (existing) {
    return NextResponse.json({ id: existing.id });
  }

  const consentAt = new Date();

  const session = await prisma.session.create({
    data: {
      participantId: participant.sub,
      consentAt,
    },
  });

  await prisma.event.create({
    data: {
      sessionId: session.id,
      type: "CONSENT_GIVEN",
      clientAt,
    },
  });

  return NextResponse.json({ id: session.id });
}
