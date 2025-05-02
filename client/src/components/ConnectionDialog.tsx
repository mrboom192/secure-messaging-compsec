import { Dialog, DialogPanel } from "@headlessui/react";
import Button from "./Button";
import { usePeerConnection } from "../contexts/PeerConnectionContext";

const ConnectionDialog = ({ role }: { role: string }) => {
  return (
    <Dialog
      open={!!role}
      onClose={() => console.log("close")}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen bg-black/50 items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 bg-background p-12">
          <DialogContent role={role} />
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ConnectionDialog;

const DialogContent = ({ role }: { role: string }) => {
  const { closeConnectionAttempt } = usePeerConnection();

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* {role === "host" ? (
        <>
          <p className="text-sm">1) Send offer to peer:</p>
          <textarea
            readOnly
            className="w-full max-w-md h-48 p-2 border-black border resize-none text-xs bg-white"
            value={offer || ""}
          />
          <p className="text-sm">2) Paste answer from peer:</p>
          <ActionInput
            value={answer}
            onTextChange={setAnswer}
            onAction={handleSetRemoteDescription}
            buttonText="Connect"
            placeholder="Paste peer SDP answer"
            buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
            disableButton={!answer}
          />
        </>
      ) : (
        <>
          <p className="text-sm">1) Paste offer from peer:</p>
          <ActionInput
            value={offer}
            onTextChange={setOffer}
            onAction={handleSetRemoteDescription}
            buttonText="Generate Answer"
            placeholder="Paste peer SDP offer"
            buttonColor="bg-fuchsia-400 hover:bg-fuchsia-500"
            disableButton={!offer}
          />
          <p className="text-sm">2) Send this answer to the host:</p>
          <textarea
            readOnly
            className="w-full max-w-md h-48 p-2 border-black border resize-none text-xs bg-white"
            value={answer || ""}
          />
        </>
      )} */}

      <Button
        onClick={closeConnectionAttempt}
        buttonText="Close"
        buttonColor="bg-rose-400 hover:bg-rose-500"
      />
    </div>
  );
};
