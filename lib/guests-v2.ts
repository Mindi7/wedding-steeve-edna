export type GuestV2 = {
  token: string;
  name: string;
  maxCompanions: number;
  companions: string[]; // noms des accompagnants déjà connus, pré-remplis (vide si pas encore renseigné)
};

// Invités du "nouveau" site (design Canva) — mêmes 24 personnes que le site original,
// mais avec des liens DIFFÉRENTS. Le site original (/invitation/[token]) ne change jamais.
export const guestsV2: GuestV2[] = [
  { token: "jean-hu66", name: "Jean", maxCompanions: 1, companions: [] },
  { token: "rodrigue-go90", name: "Rodrigue", maxCompanions: 1, companions: [] },
  { token: "williams-952p", name: "Williams", maxCompanions: 1, companions: [] },
  { token: "ednor-afhs", name: "Ednor", maxCompanions: 0, companions: [] },
  { token: "flo-g2a5", name: "Flo", maxCompanions: 3, companions: [] },
  { token: "martine-unzq", name: "Martine", maxCompanions: 0, companions: [] },
  { token: "dieuvilla-wwy6", name: "Dieuvilla", maxCompanions: 0, companions: [] },
  { token: "baby-evf9", name: "Baby", maxCompanions: 1, companions: [] },
  { token: "leyenne-8ss3", name: "Leyenne", maxCompanions: 1, companions: [] },
  { token: "joan-jtbx", name: "Joan", maxCompanions: 2, companions: [] },
  { token: "anaclara-x31f", name: "Anaclara", maxCompanions: 0, companions: [] },
  { token: "sonia-z95h", name: "Sonia", maxCompanions: 0, companions: [] },
  { token: "melithe-165z", name: "Melithe", maxCompanions: 0, companions: [] },
  { token: "vanina-7q04", name: "Vanina", maxCompanions: 0, companions: [] },
  { token: "francesca-67bo", name: "Francesca", maxCompanions: 3, companions: [] },
  { token: "patricia-id7g", name: "Patricia", maxCompanions: 1, companions: [] },
  { token: "marie-louise-14j4", name: "Marie-Louise", maxCompanions: 0, companions: [] },
  { token: "onais-oh34", name: "Onaïs", maxCompanions: 0, companions: [] },
  { token: "jessica-8q9z", name: "Jessica", maxCompanions: 2, companions: [] },
  { token: "jordan-t964", name: "Jordan", maxCompanions: 3, companions: [] },
  { token: "christian-z1ms", name: "Christian", maxCompanions: 1, companions: [] },
  { token: "frenel-racj", name: "Frenel", maxCompanions: 0, companions: [] },
  { token: "junior-375x", name: "Junior", maxCompanions: 1, companions: [] },
  { token: "marie-daniel-mq53", name: "Marie Daniel", maxCompanions: 0, companions: [] },
];

export function getGuestV2ByToken(token: string): GuestV2 | undefined {
  return guestsV2.find((g) => g.token === token);
}
