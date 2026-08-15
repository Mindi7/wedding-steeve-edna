"use client";

import { useEffect, useMemo, useState } from "react";

const SHEET_WEBHOOK_URL = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL as string | undefined;
const ACCESS_CODE = process.env.NEXT_PUBLIC_SUIVI_CODE || "steeve2026";

type Row = {
  nom: string;
  role: string;
  reponse: string;
  entree: string;
  plat: string;
  accompagnement: string;
  horodatage?: string;
};

function countBy(rows: Row[], key: "entree" | "plat" | "accompagnement") {
  const counts: Record<string, number> = {};
  for (const r of rows) {
    if (r.reponse !== "Oui" || !r[key]) continue;
    counts[r[key]] = (counts[r[key]] || 0) + 1;
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

export default function SuiviPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    if (!SHEET_WEBHOOK_URL) {
      setError("Le lien vers le Google Sheet n'est pas encore configuré.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(SHEET_WEBHOOK_URL, { cache: "no-store" });
      const data = await res.json();
      setRows(Array.isArray(data.rows) ? data.rows : []);
    } catch {
      setError("Impossible de charger les données pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!unlocked) return;
    const id = setTimeout(() => {
      void loadData();
    }, 0);
    return () => clearTimeout(id);
  }, [unlocked]);

  const oui = useMemo(() => rows.filter((r) => r.reponse === "Oui"), [rows]);
  const non = useMemo(() => rows.filter((r) => r.reponse === "Non"), [rows]);
  const entreeCounts = useMemo(() => countBy(rows, "entree"), [rows]);
  const platCounts = useMemo(() => countBy(rows, "plat"), [rows]);
  const accCounts = useMemo(() => countBy(rows, "accompagnement"), [rows]);

  if (!unlocked) {
    return (
      <main className="min-h-dvh bg-ivory flex items-center justify-center px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (codeInput === ACCESS_CODE) setUnlocked(true);
            else setError("Code incorrect");
          }}
          className="w-full max-w-xs bg-ivory border border-blush p-8 text-center"
        >
          <p className="font-script text-3xl text-terra mb-4">Suivi RSVP</p>
          <input
            type="password"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Code d'accès"
            className="w-full border border-blush bg-transparent px-4 py-3 font-serif text-choco text-center mb-3 focus:outline-none focus:border-rose"
          />
          {error && <p className="text-rose-dk text-xs mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-choco text-ivory font-sans text-sm tracking-[.2em] uppercase py-3 hover:bg-rose-dk transition-all"
          >
            Accéder
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-ivory px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="font-script text-4xl text-terra leading-none">Suivi</p>
            <p className="font-serif text-lg tracking-[.2em] uppercase text-choco mt-1">RSVP</p>
          </div>
          <button
            onClick={loadData}
            className="font-sans text-xs uppercase tracking-wide border border-blush px-4 py-2.5 hover:bg-blush-lt transition-all"
          >
            {loading ? "..." : "↻ Actualiser"}
          </button>
        </div>

        {error && <p className="text-rose-dk text-sm mb-6 bg-rose/10 border border-rose/30 px-4 py-3">{error}</p>}

        {/* Résumé global */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-blush-lt border border-blush py-5 text-center">
            <p className="font-serif text-4xl text-choco">{oui.length}</p>
            <p className="font-sans text-[0.6rem] tracking-widest uppercase text-taupe mt-1">Confirmées</p>
          </div>
          <div className="bg-ivory border border-blush py-5 text-center">
            <p className="font-serif text-4xl text-choco">{non.length}</p>
            <p className="font-sans text-[0.6rem] tracking-widest uppercase text-taupe mt-1">Non venants</p>
          </div>
        </div>

        {/* Récap menu — prêt pour capture d'écran traiteur */}
        <div className="bg-ivory border border-blush p-6 mb-8">
          <p className="font-sans text-[0.65rem] tracking-[.25em] uppercase text-rose mb-5 text-center">
            Récapitulatif menu · pour le traiteur
          </p>
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-serif text-sm text-terra font-semibold mb-2 pb-1 border-b border-blush">Entrée</p>
              {entreeCounts.length === 0 && <p className="text-xs text-taupe/70">Aucune réponse pour l&apos;instant</p>}
              {entreeCounts.map(([label, n]) => (
                <p key={label} className="font-serif text-sm text-choco mb-1.5 leading-snug">
                  <span className="text-terra font-bold">{n}×</span> {label}
                </p>
              ))}
            </div>
            <div>
              <p className="font-serif text-sm text-terra font-semibold mb-2 pb-1 border-b border-blush">Plat de résistance</p>
              {platCounts.length === 0 && <p className="text-xs text-taupe/70">Aucune réponse pour l&apos;instant</p>}
              {platCounts.map(([label, n]) => (
                <p key={label} className="font-serif text-sm text-choco mb-1.5 leading-snug">
                  <span className="text-terra font-bold">{n}×</span> {label}
                </p>
              ))}
            </div>
            <div>
              <p className="font-serif text-sm text-terra font-semibold mb-2 pb-1 border-b border-blush">Accompagnement</p>
              {accCounts.length === 0 && <p className="text-xs text-taupe/70">Aucune réponse pour l&apos;instant</p>}
              {accCounts.map(([label, n]) => (
                <p key={label} className="font-serif text-sm text-choco mb-1.5 leading-snug">
                  <span className="text-terra font-bold">{n}×</span> {label}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Détail par personne — cartes individuelles, texte jamais coupé */}
        <div>
          <p className="font-sans text-[0.65rem] tracking-[.25em] uppercase text-rose mb-4 text-center">Détail par personne</p>
          <div className="flex flex-col gap-3">
            {rows.map((r, i) => (
              <div key={i} className="bg-ivory border border-blush p-5">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-serif text-lg text-choco font-semibold">{r.nom}</p>
                  <span
                    className={`font-sans text-[0.6rem] tracking-wide uppercase px-2.5 py-1 ${
                      r.reponse === "Oui" ? "bg-sage/20 text-sage" : "bg-rose/15 text-rose-dk"
                    }`}
                  >
                    {r.reponse === "Oui" ? "Confirmé" : "Non venant"}
                  </span>
                </div>
                <p className="font-sans text-[0.65rem] text-taupe uppercase tracking-wide mb-3">{r.role}</p>
                {r.reponse === "Oui" && (
                  <div className="flex flex-col gap-1.5 pt-3 border-t border-blush/60">
                    <p className="font-serif text-sm text-choco leading-snug">
                      <span className="text-[0.6rem] tracking-wide uppercase text-taupe mr-2">Entrée</span>
                      {r.entree || "—"}
                    </p>
                    <p className="font-serif text-sm text-choco leading-snug">
                      <span className="text-[0.6rem] tracking-wide uppercase text-taupe mr-2">Plat</span>
                      {r.plat || "—"}
                    </p>
                    <p className="font-serif text-sm text-choco leading-snug">
                      <span className="text-[0.6rem] tracking-wide uppercase text-taupe mr-2">Accomp.</span>
                      {r.accompagnement || "—"}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {rows.length === 0 && !loading && (
              <p className="text-center text-taupe text-sm py-8">Aucune réponse pour l&apos;instant.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
