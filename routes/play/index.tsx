import { Head } from "$fresh/runtime.ts";
import { JoinForm } from "../../components/JoinForm.tsx";

export default function JoinWithoutGameId() {
  return (
    <>
      <Head>
        <title>Join Game</title>
      </Head>
      <div class="px-4 py-8 mx-auto">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <JoinForm gameId="" />
        </div>
      </div>
    </>
  );
}