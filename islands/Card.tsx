import { useEffect, useState } from "preact/hooks";
import { LoadingCard } from "../components/Loader.tsx";

export function Card({ playerId }: { playerId: string }) {
  const [clientValue, updateClientValue] = useState("");
  const [hideCard, changeHideCardValue] = useState(true);
  const [loading, changeLoadingValue] = useState(true);
  const toggleHideCard = () => changeHideCardValue(!hideCard);

  useEffect(() => {
    const sse = new EventSource(`/sse/player/${playerId}`);
    sse.onerror = (err) => {
      console.log("Connection Error");
      sse.close();
    };

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.player.playerRole);

      if (data.player.playerRole) {
        updateClientValue(data.player.playerRole);
        changeLoadingValue(false);
      } else {
        changeLoadingValue(true);
      }
    };
  }, []);

  return (
    <>
      {loading ? <LoadingCard /> : (
        <img
          onClick={toggleHideCard}
          class="mx-auto cursor-pointer h-64"
          src={hideCard
            ? "/images/cards/backside.jpg"
            : `/images/cards/${clientValue}.jpg`}
          alt="card"
        />
      )}
    </>
  );
}
