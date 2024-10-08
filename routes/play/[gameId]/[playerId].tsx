import { Head } from "$fresh/runtime.ts";

import { Handlers, PageProps } from "$fresh/server.ts";
import { getPlayer, type Player } from "../../../utils/game.ts";
import { Card } from "../../../islands/Card.tsx";
import { GameOverview } from "../../../islands/GameOverview.tsx";
import { QrDialog } from "../../../islands/QrDialog.tsx";
import { Button } from "../../../islands/StartButton.tsx";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { gameId, playerId } = ctx.params;
    const player: Player = await getPlayer(playerId);
    if (!player) {
      return ctx.render({ error: "Player not found" });
    }

    return ctx.render({ player, origin: new URL(req.url).origin });
  },
};

export default function JoinWithoutGameId(
  props: PageProps<{ player: Player; origin: string }>,
) {
  const { gameId, playerId } = props.params;
  const { player, origin } = props.data;
  return (
    <>
      <Head>
        <title>Play</title>
        <link rel="stylesheet" href="/loader.css" />
      </Head>
      {props.error
        ? <p>{props.error}</p>
        : (
          <div class="h-screen px-4 py-8 mx-auto">
            <div class="h-full max-w-screen-md mx-auto flex flex-col items-center justify-between">
              <div class="h-full flex flex-col items-center">
                {player.role === "game-master"
                  ? (
                    <>
                      <h1 class="font-bold text-2xl">
                        You are the game master
                      </h1>
                    </>
                  )
                  : <Card playerId={player.id} />}
                <GameOverview gameId={gameId} playerId={playerId} />
              </div>

              <div
                class="a2a_kit a2a_kit_size_32 a2a_default_style"
                data-a2a-url={`${origin}/play/${gameId}`}
              >
                <a class="a2a_button_whatsapp"></a>
                <QrDialog gameId={gameId} origin={origin} />
              </div>
              <script async src="https://static.addtoany.com/menu/page.js">
              </script>
            </div>
          </div>
        )}
    </>
  );
}
