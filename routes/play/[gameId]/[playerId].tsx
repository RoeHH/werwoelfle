import { Head } from "$fresh/runtime.ts";

import { Handlers, PageProps } from "$fresh/server.ts";
import { type Player, getPlayer } from "../../../utils/game.ts";
import { Card } from "../../../islands/Card.tsx";
import { GameOverview } from "../../../islands/GameOverview.tsx";
import { Button } from "../../../islands/StartButton.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { gameId, playerId } = ctx.params;
    const player: Player = await getPlayer(playerId);
    if (!player) {
      return ctx.render({ error: "Player not found" });
    }
    
    return ctx.render({player, origin: new URL(req.url).origin});
  },
};

export default function JoinWithoutGameId(props: PageProps<{player: Player, origin: string}>) {
  const { gameId, playerId } = props.params;
  const { player, origin } = props.data;  
  return (
    <>
      <Head>
        <title>Play</title>
        <link rel="stylesheet" href="/loader.css" />
      </Head>
      {props.error ? <p>{props.error}</p> :
        <div class="px-4 py-8 mx-auto">
          <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            {player.role === "game-master" ? (
              <>
                {/*<img src={`https://qr.roeh.ch/${origin}/play/${gameId}`} alt="Join QR code" />*/}
                <div class="a2a_kit a2a_kit_size_32 a2a_default_style" data-a2a-url={`${origin}/play/${gameId}`}>
                  <a class="a2a_button_whatsapp"></a>
                  <a class="a2a_button_snapchat"></a>
                  <a class="a2a_button_facebook_messenger"></a>
                  <a class="a2a_button_telegram"></a>
                  <a class="a2a_button_threema"></a>
                </div>
                <script async src="https://static.addtoany.com/menu/page.js"></script>
                <h1>You are the game master</h1>
                <Button gameId={gameId} endpoint="start" text="Start Game"/>
                <Button gameId={gameId} endpoint="end" text="End Game"/>
              </>
            ) : (
              <Card playerId={player.id}/>
            )}
            <GameOverview gameId={gameId} playerId={playerId}/>
          </div>
        </div>
      }
    </>
  );
}