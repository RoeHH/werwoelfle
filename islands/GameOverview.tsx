import { useEffect, useState } from "preact/hooks";
import { type Game } from "../utils/game.ts";

export function GameOverview({gameId, playerId}: {gameId: string, playerId: string}) {
  const [gameState, updateGameState] = useState<Game>();

  useEffect(() => {
    const sse = new EventSource(`/sse/game/${gameId}/${playerId}`);
    sse.onerror = (err) => {
      console.log("Connection Error");
      sse.close();
    };

    sse.onmessage = (event) => {
      console.log(event.data);
      
      const data = JSON.parse(event.data);
      console.log(data);
      updateGameState(data.game);

      
    };
  }, []);

  const addOneOfTheRolle = (role: string) => async () => {
    const response = await fetch(`/api/game/${gameId}/distribution/change/${role}`);
    console.log(response);
  }

  return (
    <>
    <p>Verteilung</p>
    <table>
      <tr>
        {Object.keys(gameState?.distribution || {}).map((role) => (<td><img onClick={addOneOfTheRolle(role)} class="mx-auto h-8" src={ `/images/cards/${role}.jpg` } alt={role} /></td>))}
      </tr>
      <tr>
        {Object.values(gameState?.distribution || {}).map((count) => (<td><p class="text-center w-full">{count}</p></td>))}
      </tr>
    </table>
    </>
  );
}