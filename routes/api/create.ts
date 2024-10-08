import { Handlers } from "$fresh/server.ts";
import { createGame } from "../../utils/game.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const { gameId, gameMaster } = await createGame();
    console.log(gameMaster, "gameMaster registered", gameId);

    return Response.redirect(
      `${new URL(req.url).origin}/play/${gameId}/${gameMaster.id}`,
      303,
    );
  },
};
