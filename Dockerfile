# Mehrstufiges (multi-stage) Dockerfile. Grundidee: jede Stufe (FROM ... AS
# ...) ist ein eigenes Zwischen-Image. Nur die letzte Stufe ("runner") wird
# am Ende tatsaechlich zum fertigen Image - alles, was frueheren Stufen nur
# zum BAUEN gedient hat (z.B. TypeScript-Quellcode), landet nicht darin.
#
# "node:22-bookworm-slim" statt "node:22-alpine": Alpine nutzt musl statt
# glibc, und Prisma's Engine-Binaries brauchen dafuer eine gesonderte
# Konfiguration (binaryTargets in schema.prisma). Debian "slim" ist knapp
# 100MB groesser, dafuer gibt es diese Fehlerklasse gar nicht erst - fuer den
# Anfang die robustere Wahl.

FROM node:22-bookworm-slim AS base
# Prisma's Engine-Binary verlinkt zur Laufzeit gegen OpenSSL - die "slim"-
# Variante bringt das nicht von Haus aus mit.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# ---- Stufe 1: nur Abhaengigkeiten installieren ----
# Eigene Stufe, weil Docker jede Stufe cached: solange sich package.json und
# package-lock.json nicht aendern, ueberspringt ein erneuter Build diesen
# (langsamsten) Schritt komplett und nutzt den Cache.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stufe 2: die App bauen ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Generiert den Prisma-Client passend zu DIESEM Linux-Container - der lokal
# unter Windows generierte Client (src/generated/prisma, ohnehin per
# .gitignore nie im Repo) waere hier nicht lauffaehig.
RUN npx prisma generate
RUN npm run build

# ---- Stufe 3: das Image, das am Ende wirklich laeuft ----
FROM base AS runner
ENV NODE_ENV=production

# Volles node_modules (nicht nur Produktions-Abhaengigkeiten), damit
# "npx prisma migrate deploy" und "npx prisma db seed" direkt in diesem
# Container funktionieren (siehe docs/CHECKLIST.md Phase I) - beide
# brauchen das Prisma-CLI und tsx, die sonst als reine Dev-Abhaengigkeiten
# aussortiert wuerden.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json
# prisma/seed.ts importiert per "@/..." aus src/ (tsx fuehrt es direkt aus,
# ungebaut) - dafuer muessen die Quellen und die Pfad-Aliase aus
# tsconfig.json hier mit rein, nicht nur das fertige .next-Ergebnis.
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000
CMD ["npm", "start"]
