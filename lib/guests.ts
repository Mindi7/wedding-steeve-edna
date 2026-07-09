export type Guest = {
  token: string;
  name: string;
};

// Invités du mariage — chacun a un lien personnel /invitation/[token]
export const guests: Guest[] = [
  { token: "william-k7x2", name: "William" },
  { token: "mymt-p9q4", name: "Mymt" },
  { token: "rose-m3n8", name: "Rose" },
  { token: "mark-t5v1", name: "Mark" },
];

export function getGuestByToken(token: string): Guest | undefined {
  return guests.find((g) => g.token === token);
}
