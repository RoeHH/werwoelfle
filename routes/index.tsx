import { Head } from "$fresh/runtime.ts";

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Werwölfle</title>
      </Head>
      <div class="px-4 py-8 mx-auto">
        <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <form action="/api/create" method="post">
            <h1 class="my-4 text-3xl font-bold">Spiel Erstellen</h1>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 px-4 rounded w-full">Erstellen</button>
          </form>    
        </div>
      </div>
    </>
  );
}