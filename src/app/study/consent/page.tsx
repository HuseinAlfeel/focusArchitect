import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { consentContent } from "@/content/consent";
import { ConsentForm } from "./consent-form";

export default async function ConsentPage() {
  const participant = await getCurrentParticipant();
  if (!participant) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-medium">{consentContent.title}</h1>
        <p className="mt-2 text-sm opacity-80">{consentContent.intro}</p>
      </div>

      <ConsentForm />
    </main>
  );
}
