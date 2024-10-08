import { Handlers } from "$fresh/server.ts";
import { getPlayer } from "../../../../utils/game.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { gameId, playerId } = ctx.params;

    const player = await getPlayer(playerId);

    return new Response(JSON.stringify(player), { status: 200 });
  },
};
