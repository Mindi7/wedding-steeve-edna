export type Guest = {
  token: string;
  name: string;
  maxCompanions: number;
};

// Invités du mariage — chacun a un lien personnel /invitation/[token]
// maxCompanions : nombre maximum de personnes que l'invité peut faire venir avec lui (0 = ne peut inviter personne)
export const guests: Guest[] = [
  { token: "jean-hbrp", name: "Jean", maxCompanions: 1 },
  { token: "rodrigue-oig8", name: "Rodrigue", maxCompanions: 1 },
  { token: "williams-f1cb", name: "Williams", maxCompanions: 1 },
  { token: "ednor-fno6", name: "Ednor", maxCompanions: 0 },
  { token: "flo-b9m8", name: "Flo", maxCompanions: 3 },
  { token: "martine-0o2r", name: "Martine", maxCompanions: 0 },
  { token: "dieuvilla-ak1v", name: "Dieuvilla", maxCompanions: 0 },
  { token: "baby-rjnv", name: "Baby", maxCompanions: 1 },
  { token: "leyenne-gfyg", name: "Leyenne", maxCompanions: 1 },
  { token: "joan-wwqc", name: "Joan", maxCompanions: 2 },
  { token: "anaclara-38hy", name: "Anaclara", maxCompanions: 0 },
  { token: "sonia-f9sx", name: "Sonia", maxCompanions: 0 },
  { token: "melithe-meco", name: "Melithe", maxCompanions: 0 },
  { token: "vanina-sfog", name: "Vanina", maxCompanions: 0 },
  { token: "francesca-yr3x", name: "Francesca", maxCompanions: 3 },
  { token: "patricia-kxwn", name: "Patricia", maxCompanions: 1 },
  { token: "marie-louise-hq2v", name: "Marie-Louise", maxCompanions: 0 },
  { token: "onais-r9ou", name: "Onaïs", maxCompanions: 0 },
  { token: "jessica-docu", name: "Jessica", maxCompanions: 2 },
  { token: "jordan-zren", name: "Jordan", maxCompanions: 3 },
  { token: "christian-un5z", name: "Christian", maxCompanions: 1 },
  { token: "frenel-3jqi", name: "Frenel", maxCompanions: 0 },
];

export function getGuestByToken(token: string): Guest | undefined {
  return guests.find((g) => g.token === token);
}
