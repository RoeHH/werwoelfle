import { useEffect, useState } from "preact/hooks";
import { type Game, Player } from "../utils/game.ts";
import { QrDialog } from "./QrDialog.tsx";
import { Button } from "./StartButton.tsx";

export function GameOverview(
  { gameId, playerId }: { gameId: string; playerId: string },
) {
  const [gameState, updateGameState] = useState<Game>();
  const [currentPlayer, updateCurrentPlayer] = useState<Player>();

  useEffect(() => {
    const sse = new EventSource(`/sse/game/${gameId}`);
    sse.onerror = (err) => {
      console.log("Connection Error");
      sse.close();
    };

    sse.onmessage = (event) => {
      console.log(event.data);

      const data = JSON.parse(event.data);
      console.log(data);
      updateGameState(data.game);
      updateCurrentPlayer(
        data.game.players.find((player: Player) => player?.id === playerId),
      );
    };
  }, []);

  const addOneOfTheRolle = (role: string) => async () => {
    if (currentPlayer?.role !== "game-master") {
      return;
    }
    const response = await fetch(
      `/api/game/${gameId}/distribution/change/${role}`,
    );
    console.log(response);
  };

  return (
    <>
      {currentPlayer?.role !== 'game-master' && gameState?.started ? null : (
        <>
          <p class="mt-4">Verteilung</p>
          <table>
            <tbody>
              <tr>
                {Object.keys(gameState?.distribution || {}).map((role) => (
                  <td>
                    <img
                      onClick={addOneOfTheRolle(role)}
                      class="mx-auto h-8"
                      src={`/images/cards/${role}.jpg`}
                      alt={role}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                {Object.values(gameState?.distribution || {}).map((count) => (
                  <td>
                    <p class="text-center w-full">{count}</p>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </>
      )}
      {currentPlayer?.role === "game-master" && (
        <>
          <button
            onClick={async () =>
              await fetch(`/api/start`, {
                body: JSON.stringify({ gameId }),
                method: "POST",
              })}
            class="font-bold p-2 px-4 rounded w-full"
          >
            Neue Runde starten
          </button>
          <button
            onClick={async () =>
              await fetch(`/api/end`, {
                body: JSON.stringify({ gameId }),
                method: "POST",
              })}
            class="font-bold p-2 px-4 rounded w-full"
          >
            Runde beenden
          </button>
        </>
      )}
      <ul class="mt-4">
        {gameState?.players.filter((player: Player) =>
          player.role !== "game-master"
        )
          .filter((player: Player) => player.playerRole !== undefined || !gameState.started || currentPlayer?.role === "game-master")
          .map((player: Player) => (
            <li class="flex justify-evenly mt-1">
              <img
                class="mx-auto h-8"
                src={`/images/cards/${
                  currentPlayer?.role  === "game-master" && player.playerRole !== undefined 
                    ? player.playerRole
                    : "backside"
                }.jpg`}
                alt={currentPlayer?.role === "game-master"
                  ? player.playerRole
                  : "backside"}
              />
              <p class="w-full ml-1">{player.name}</p>
            </li>
          ))}
      </ul>
    </>
  );
}
