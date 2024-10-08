import {
  createRef,
  Ref,
} from "https://esm.sh/v128/preact@10.22.0/src/index.js";
import { JSXInternal } from "https://esm.sh/v128/preact@10.22.0/src/jsx.d.ts";

export function QrDialog(
  { gameId, origin }: { gameId: string; origin: string },
) {
  const dialog = createRef<HTMLDialogElement>();

  return (
    <>
      <img
        class="h-8 cursor-pointer"
        src={`https://qr.roeh.ch/${origin}/play/${gameId}`}
        alt="Join QR code"
        onClick={() => dialog.current?.showModal()}
      />
      <dialog
        id="qrDialog"
        ref={dialog}
        onClick={() => dialog.current?.close()}
      >
        <img
          src={`https://qr.roeh.ch/${origin}/play/${gameId}`}
          alt="Join QR code"
        />
        <p type="text" value={`${origin}/play/${gameId}`} />
      </dialog>
    </>
  );
}
