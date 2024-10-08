import { Handlers } from "$fresh/server.ts";
import { startGame } from "../../utils/game.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {

    const {gameId} = await req.json();

    
    await startGame(gameId);

    return new Response("Game started", {status: 200});
  },
};