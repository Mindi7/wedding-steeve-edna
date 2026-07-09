import { getGuestByToken } from "@/lib/guests";
import InvitationClient from "./InvitationClient";

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = getGuestByToken(token);

  if (!guest) {
    return (
      <main className="min-h-screen bg-ivory flex items-center justify-center px-6 text-center">
        <p className="font-serif italic text-taupe text-lg">
          Cette invitation est introuvable. Vérifiez le lien reçu.
        </p>
      </main>
    );
  }

  return <InvitationClient guest={guest} />;
}
