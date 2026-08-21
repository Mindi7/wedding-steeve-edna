export type GuestV2 = {
  token: string;
  name: string;
  maxCompanions: number;
  companions: string[]; // noms des accompagnants déjà connus, pré-remplis (vide si pas encore renseigné)
  multiUse?: boolean; // si true, ce lien peut servir à répondre plusieurs fois de suite (pas de blocage après envoi)
};

// Invités du "nouveau" site (design Canva) — mêmes 24 personnes que le site original,
// mais avec des liens DIFFÉRENTS. Le site original (/invitation/[token]) ne change jamais.
export const guestsV2: GuestV2[] = [
  // --- Compte de TEST uniquement (ne pas envoyer) ---
  { token: "test-demo-3acc", name: "Test", maxCompanions: 3, companions: ["Luce", "Swaan"] },

  // --- Vrais invités ---
  { token: "jean-hu66", name: "Jean", maxCompanions: 1, companions: [] },
  { token: "rodrigue-go90", name: "Rodrigue", maxCompanions: 1, companions: ["Anyela"] },
  { token: "williams-952p", name: "Williams", maxCompanions: 1, companions: ["Mya"] },
  { token: "ednor-afhs", name: "Ednor", maxCompanions: 0, companions: [] },
  { token: "flo-g2a5", name: "Flo", maxCompanions: 3, companions: ["Luce", "Swaan"] },
  { token: "martine-unzq", name: "Martine", maxCompanions: 0, companions: [] },
  { token: "dieuvilla-wwy6", name: "Dieuvilla", maxCompanions: 0, companions: [] },
  { token: "baby-evf9", name: "Baby", maxCompanions: 1, companions: ["Catiana"] },
  { token: "joan-jtbx", name: "Joan", maxCompanions: 2, companions: ["Cédric", "Sarael"] },
  { token: "anaclara-x31f", name: "Anaclara", maxCompanions: 0, companions: [] },
  { token: "sonia-z95h", name: "Sonia", maxCompanions: 0, companions: [] },
  { token: "melithe-165z", name: "Melithe", maxCompanions: 0, companions: [] },
  { token: "vanina-7q04", name: "Vanina", maxCompanions: 0, companions: [] },
  { token: "francesca-67bo", name: "Francesca", maxCompanions: 3, companions: ["Géryane", "Pèpette", "Lalann"] },
  { token: "patricia-7n9s", name: "Patricia", maxCompanions: 1, companions: [] },
  { token: "marie-louise-14j4", name: "Marie-Louise", maxCompanions: 0, companions: [] },
  { token: "onais-oh34", name: "Onaïs", maxCompanions: 0, companions: [] },
  { token: "jessica-8q9z", name: "Jessica", maxCompanions: 3, companions: ["Simon Edwens", "Dumorin jean-julien", "Maëva"] },
  { token: "jordan-t964", name: "Jordan", maxCompanions: 3, companions: [] },
  { token: "christian-z1ms", name: "Christian", maxCompanions: 1, companions: [] },
  { token: "frenel-racj", name: "Frenel", maxCompanions: 0, companions: [] },
  { token: "junior-375x", name: "Junior", maxCompanions: 1, companions: [] },
  { token: "marie-daniel-mq53", name: "Marie Daniel", maxCompanions: 0, companions: [] },

  // --- Ajoutés le 14/08 : témoins/famille + cortège ---
  { token: "antoine-b5ot", name: "Antoine", maxCompanions: 0, companions: [] },
  { token: "belony-iea8", name: "Belony", maxCompanions: 0, companions: [] },
  { token: "job-2ynz", name: "Job", maxCompanions: 1, companions: [] },
  { token: "ernso-tvxh", name: "Ernso", maxCompanions: 1, companions: [] },
  { token: "dayou-j5ff", name: "Dayou", maxCompanions: 0, companions: [] },
  { token: "sam-3rbc", name: "Sam", maxCompanions: 0, companions: [] },
  { token: "nathou-gw4e", name: "Nathou", maxCompanions: 0, companions: [] },
  { token: "lyta-m9qw", name: "Lyta", maxCompanions: 0, companions: [] },
  { token: "dia-wm2v", name: "Dia", maxCompanions: 0, companions: [] },
  { token: "rudjy-fb79", name: "Rudjy", maxCompanions: 0, companions: [] },

  // --- Ajoutés le 15/08 ---
  { token: "ata-lxt5", name: "Ata", maxCompanions: 0, companions: [] },
  { token: "bruno-51ny", name: "Bruno", maxCompanions: 0, companions: [] },
  { token: "orvilan-ry5p", name: "Orvilan", maxCompanions: 0, companions: [] },
  { token: "irene-az1s", name: "Irène", maxCompanions: 0, companions: [] },
  { token: "fanie-dyuw", name: "Fanie", maxCompanions: 0, companions: [] },
  { token: "clairmitha-z34h", name: "Clairmitha", maxCompanions: 0, companions: [] },
  { token: "mere-de-steeve-y5vo", name: "Mère de Steeve", maxCompanions: 0, companions: [] },
  { token: "pere-de-steeve-lzkq", name: "Père de Steeve", maxCompanions: 0, companions: [] },
  { token: "widner-g8y9", name: "Widner", maxCompanions: 0, companions: [] },
  { token: "janette-biem", name: "Janette", maxCompanions: 1, companions: [] },
  { token: "jordan-m-s7h9", name: "Jordan M", maxCompanions: 0, companions: [] },
  { token: "jean-wilson-fi8q", name: "Jean Wilson", maxCompanions: 0, companions: [] },
  { token: "marianne-cdr2", name: "Marianne", maxCompanions: 2, companions: ["Abigaëlle", "Erwan"] },
  { token: "smoke-e5f0", name: "Smoke", maxCompanions: 1, companions: [] },
  { token: "franck-5tdj", name: "Franck", maxCompanions: 0, companions: [] },
  { token: "smock-tijb", name: "Smock", maxCompanions: 1, companions: [] },
  { token: "chardy-906e", name: "Chardy", maxCompanions: 1, companions: [] },
  { token: "ismael-fe43", name: "Ismaël", maxCompanions: 0, companions: [] },
  { token: "invite-sdhiil", name: "", maxCompanions: 1, companions: [] },
  { token: "cous-multi-jbp4hy", name: "", maxCompanions: 1, companions: [], multiUse: true },
];

export function getGuestV2ByToken(token: string): GuestV2 | undefined {
  return guestsV2.find((g) => g.token === token);
}
