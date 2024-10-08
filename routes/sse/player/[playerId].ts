import { Handlers } from "$fresh/server.ts";
import {
  ServerSentEventStream,
} from "jsr:@std/http";


export const handler: Handlers = { 
  async GET(req, ctx) {

    const playerId = ctx.params.playerId;

    const db = await Deno.openKv()

    return new Response(new ReadableStream({
      async start(controller) {
        for await (const [{ value: message }] of db.watch([['player', playerId]])) {
          console.log('message', message);
          
          controller.enqueue({
            data: JSON.stringify({player: message}),
            id: Date.now(),
            event: 'message'
          })
        }
      },
      cancel() {
        console.log('cancel stream lol wtf')
      },
    }).pipeThrough(new ServerSentEventStream()), {
      headers: {
        "Content-Type": "text/event-stream",
      },
    })
  }
};