export function JoinForm({gameId}: {gameId: string}) {


  return (
    <>
      <form action="/api/register" method="post">
        <h1 class="my-4 text-3xl font-bold">Spiel Beitreten</h1>
        <input type="text" name="gameId" value={gameId} placeholder="Spiel ID" class="w-full my-1 p-2 border-2 border-blue-500 rounded" />
        <br />
        <input type="text" name="playerName" placeholder="Spielername" class="w-full my-1 p-2 border-2 border-blue-500 rounded" />
        <br />
        <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-4 rounded w-full">Beitreten</button>
      </form>        
    </>
  );
}
