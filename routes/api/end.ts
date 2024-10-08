import { Handlers } from "$fresh/server.ts";
import { endGame } from "../../utils/game.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {

    const {gameId} = await req.json();
    
    await endGame(gameId);

    return new Response("Game ended", {status: 200});
  },
};