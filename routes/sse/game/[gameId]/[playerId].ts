import { Handlers } from "$fresh/server.ts";
import {
  ServerSentEventStream,
} from "jsr:@std/http";


export const handler: Handlers = { 
  async GET(req, ctx) {

    const {playerId, gameId} = ctx.params;

    const db = await Deno.openKv()

    return new Response(new ReadableStream({
      async start(controller) {
        for await (const [{ value: message }] of db.watch([['game', gameId]])) {
          console.log('message game', message);

          
          controller.enqueue({
            data: JSON.stringify({game: message}),
            id: Date.now(),
            event: 'message'
          })
        }
      },
      cancel() {
        console.log('cancel stream game lol wtf')
      },
    }).pipeThrough(new ServerSentEventStream()), {
      headers: {
        "Content-Type": "text/event-stream",
      },
    })
  }
};