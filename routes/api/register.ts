import { Handlers } from "$fresh/server.ts";
import { registerPlayer } from "../../utils/game.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const formData = await req.formData();

    const gameId = formData.get("gameId");
    const playerName = formData.get("playerName");

    console.log(gameId, playerName);

    const player = await registerPlayer(
      gameId?.toString() || "",
      playerName?.toString() || "",
    );
    if (!player) {
      return new Response("Game not found", { status: 404 });
    }
    console.log(player, "player registered");

    return Response.redirect(
      `${new URL(req.url).origin}/play/${gameId}/${player.id}`,
      303,
    );
  },
};
