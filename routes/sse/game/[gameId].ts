import { Handlers } from "$fresh/server.ts";
import { ServerSentEventStream } from "jsr:@std/http";
import { Game, Player } from "../../../utils/game.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { gameId } = ctx.params;

    const db = await Deno.openKv();

    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (
            const [{ value: message }] of db.watch([["game", gameId]])
          ) {
            const game = message as Game;
            console.log("message game", message);

            const playerIds = game.players;
            game.players = [];
            for await (const playerId of playerIds) {
              game.players.push(
                (await db.get(["player", playerId])).value as Player,
              );
            }

            controller.enqueue({
              data: JSON.stringify({ game }),
              id: Date.now(),
              event: "message",
            });
          }
        },
        cancel() {
          console.log("cancel stream game lol wtf");
        },
      }).pipeThrough(new ServerSentEventStream()),
      {
        headers: {
          "Content-Type": "text/event-stream",
        },
      },
    );
  },
};
