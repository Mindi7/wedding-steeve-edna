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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <p className="font-script text-3xl text-terra">Suivi RSVP</p>
          <button
            onClick={loadData}
            className="font-sans text-xs uppercase tracking-wide border border-blush px-4 py-2 hover:bg-blush-lt transition-all"
          >
            {loading ? "..." : "Actualiser"}
          </button>
        </div>

        {error && <p className="text-rose-dk text-sm mb-6">{error}</p>}

        {/* Résumé global */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <div className="bg-blush-lt border border-blush p-4 text-center">
            <p className="font-serif text-3xl text-choco">{oui.length}</p>
            <p className="font-sans text-[0.6rem] tracking-wide uppercase text-taupe">Personnes confirmées</p>
          </div>
          <div className="bg-blush-lt border border-blush p-4 text-center">
            <p className="font-serif text-3xl text-choco">{non.length}</p>
            <p className="font-sans text-[0.6rem] tracking-wide uppercase text-taupe">Réponses négatives</p>
          </div>
        </div>

        {/* Récap menu — prêt pour capture d'écran traiteur */}
        <div className="bg-ivory border border-blush p-6 mb-10">
          <p className="font-sans text-xs tracking-[.2em] uppercase text-rose mb-4">Récapitulatif menu — pour le traiteur</p>
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="font-sans text-[0.65rem] tracking-wide uppercase text-taupe mb-2">Entrée</p>
              {entreeCounts.length === 0 && <p className="text-xs text-taupe/70">—</p>}
              {entreeCounts.map(([label, n]) => (
                <p key={label} className="font-serif text-sm text-choco mb-1">
                  <span className="text-terra font-semibold">{n}×</span> {label}
                </p>
              ))}
            </div>
            <div>
              <p className="font-sans text-[0.65rem] tracking-wide uppercase text-taupe mb-2">Plat</p>
              {platCounts.length === 0 && <p className="text-xs text-taupe/70">—</p>}
              {platCounts.map(([label, n]) => (
                <p key={label} className="font-serif text-sm text-choco mb-1">
                  <span className="text-terra font-semibold">{n}×</span> {label}
                </p>
              ))}
            </div>
            <div>
              <p className="font-sans text-[0.65rem] tracking-wide uppercase text-taupe mb-2">Accompagnement</p>
              {accCounts.length === 0 && <p className="text-xs text-taupe/70">—</p>}
              {accCounts.map(([label, n]) => (
                <p key={label} className="font-serif text-sm text-choco mb-1">
                  <span className="text-terra font-semibold">{n}×</span> {label}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Détail par personne */}
        <div className="bg-ivory border border-blush overflow-hidden">
          <p className="font-sans text-xs tracking-[.2em] uppercase text-rose p-4 border-b border-blush">Détail par personne</p>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blush-lt text-[0.6rem] uppercase tracking-wide text-taupe">
                <th className="p-3">Nom</th>
                <th className="p-3">Rôle</th>
                <th className="p-3">Réponse</th>
                <th className="p-3">Entrée</th>
                <th className="p-3">Plat</th>
                <th className="p-3">Accompagnement</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-blush/60 text-sm font-serif text-choco">
                  <td className="p-3 font-medium">{r.nom}</td>
                  <td className="p-3 text-taupe text-xs">{r.role}</td>
                  <td className="p-3">
                    <span className={r.reponse === "Oui" ? "text-sage" : "text-rose-dk"}>{r.reponse}</span>
                  </td>
                  <td className="p-3 text-xs">{r.entree || "—"}</td>
                  <td className="p-3 text-xs">{r.plat || "—"}</td>
                  <td className="p-3 text-xs">{r.accompagnement || "—"}</td>
                </tr>
              ))}
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-taupe text-sm">
                    Aucune réponse pour l&apos;instant.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
