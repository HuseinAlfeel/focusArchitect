import { readFileSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

const credentialsPath = path.join(process.cwd(), "credentials.local.json");
const credentials: Record<string, string> = JSON.parse(
  readFileSync(credentialsPath, "utf-8")
);

async function main() {
  for (const [code, password] of Object.entries(credentials)) {
    const passwordHash = await bcrypt.hash(password, 10);
    const role = code === "ADMIN" ? Role.ADMIN : Role.PARTICIPANT;

    await prisma.participant.upsert({
      where: { code },
      update: { passwordHash, role },
      create: { code, passwordHash, role },
    });

    console.log(`Angelegt/aktualisiert: ${code} (${role})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
