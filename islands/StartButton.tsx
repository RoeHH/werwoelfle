
export function Button({gameId, endpoint, text}: {gameId: string, endpoint: string, text: string}) {

  const handleClick = async () => {
    await fetch(`/api/${endpoint}`, {body: JSON.stringify({gameId}), method: "POST"});
  }

  return (
    <button onClick={handleClick}>{text}</button>
  );
}