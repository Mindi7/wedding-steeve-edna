import { getGuestV2ByToken } from "@/lib/guests-v2";
import MariageClient from "./MariageClient";

export default async function MariagePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = getGuestV2ByToken(token);

  if (!guest) {
    return (
      <main className="min-h-screen bg-ivory flex items-center justify-center px-6 text-center">
        <p className="font-serif italic text-taupe text-lg">
          Cette invitation est introuvable. Vérifiez le lien reçu.
        </p>
      </main>
    );
  }

  return <MariageClient guest={guest} />;
}
