import { Handlers } from "$fresh/server.ts";

const cards = [
  "/images/cards/hexe.jpg",
  "/images/cards/seherin.jpg",
  "/images/cards/werwolf.jpg",
  "/images/cards/dorfbewohner.jpg",
];


export const handler: Handlers = {
  async GET(_req: Request) {
    const card = getRandomCard();
    const db = await Deno.openKv()

    db.set(['sse'], card)

    return new Response(card)
}
}

function getRandomCard() {
  return cards[Math.floor(Math.random() * cards.length)];
}