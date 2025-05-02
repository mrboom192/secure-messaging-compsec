import { createPeerConnection, CreatePeerConnectionResponse } from "p2p-chat";
import React, {
  createContext,
  FC,
  useState,
  useRef,
  useCallback,
  useContext,
} from "react";

export enum PEER_CONNECTION_MODE {
  HOST = "HOST",
  PARTICIPANT = "PARTICIPANT",
}

const iceServers: RTCIceServer[] = [
  {
    urls: "stun:stun.l.google.com:19302",
  },
];

interface PeerConnectionContextValue {
  mode: PEER_CONNECTION_MODE | undefined;
  isConnected: boolean;
  localConnectionDescription: string | undefined;
  startAsHost: () => void;
  closeConnectionAttempt: () => void;
  startAsParticipant: (connectionDescription: string) => void;
  setRemoteConnectionDescription: (connectionDescription: string) => void;
  sendMessage: (message: unknown) => void;
}

const PeerConnectionContext = createContext<PeerConnectionContextValue>(
  {} as PeerConnectionContextValue
);

export const PeerConnectionProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<PEER_CONNECTION_MODE | undefined>(undefined);
  const [localDescription, setLocalDescription] = useState<
    string | undefined
  >();
  const [isConnected, setIsConnected] = useState(false);
  const peerConnectionRef = useRef<CreatePeerConnectionResponse>(null);

  const onChannelOpen = useCallback(() => setIsConnected(true), []);
  const onMessageReceived = useCallback((messageString: string) => {
    console.log(`Incoming: ${messageString}`);
  }, []);

  const closeConnectionAttempt = useCallback(() => {
    setMode(undefined);
    setIsConnected(false);
  }, []);

  const startAsHost = useCallback(async () => {
    if (mode) return;
    setMode(PEER_CONNECTION_MODE.HOST);

    peerConnectionRef.current = await createPeerConnection({
      iceServers,
      onMessageReceived,
      onChannelOpen,
    });

    setLocalDescription(peerConnectionRef.current.localDescription);
  }, [mode]);

  const startAsParticipant = useCallback(
    async (connectionDescription: string) => {
      if (mode) return;
      setMode(PEER_CONNECTION_MODE.PARTICIPANT);

      peerConnectionRef.current = await createPeerConnection({
        iceServers,
        remoteDescription: connectionDescription,
        onMessageReceived,
        onChannelOpen,
      });

      setLocalDescription(peerConnectionRef.current.localDescription);
    },
    [mode]
  );

  const setRemoteConnectionDescription = useCallback(
    (connectionDescription: string) => {
      peerConnectionRef.current?.setAnswerDescription(connectionDescription);
    },
    []
  );

  const sendMessage = useCallback((message: unknown) => {
    if (!peerConnectionRef.current) return;
    const messageString = JSON.stringify(message);
    peerConnectionRef.current.sendMessage(messageString);
  }, []);

  const localConnectionDescription = localDescription;

  return (
    <PeerConnectionContext.Provider
      value={{
        mode,
        isConnected,
        localConnectionDescription,
        startAsHost,
        closeConnectionAttempt,
        startAsParticipant,
        setRemoteConnectionDescription,
        sendMessage,
      }}
    >
      {children}
    </PeerConnectionContext.Provider>
  );
};

export const usePeerConnection = <T,>() => {
  const {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    closeConnectionAttempt,
    startAsParticipant,
    setRemoteConnectionDescription,
    sendMessage,
  } = useContext(PeerConnectionContext);

  return {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    closeConnectionAttempt,
    startAsParticipant,
    setRemoteConnectionDescription,
    sendMessage: sendMessage as (message: T) => void,
  };
};
