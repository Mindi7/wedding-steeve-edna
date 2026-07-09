export type Guest = {
  token: string;
  name: string;
  maxCompanions: number;
};

// Invités du mariage — chacun a un lien personnel /invitation/[token]
// maxCompanions : nombre maximum de personnes que l'invité peut faire venir avec lui (0 = ne peut inviter personne)
export const guests: Guest[] = [
  { token: "william-k7x2", name: "William", maxCompanions: 0 },
  { token: "mymt-p9q4", name: "Mymt", maxCompanions: 0 },
  { token: "rose-m3n8", name: "Rose", maxCompanions: 1 },
  { token: "mark-t5v1", name: "Mark", maxCompanions: 3 },
];

export function getGuestByToken(token: string): Guest | undefined {
  return guests.find((g) => g.token === token);
}
