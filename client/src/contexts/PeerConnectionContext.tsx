import { createPeerConnection, CreatePeerConnectionResponse } from "p2p-chat";
import React, {
  createContext,
  FC,
  useState,
  useRef,
  useCallback,
  useContext,
  useMemo,
} from "react";
export type ConnectionDescription = {
  description: string;
};

export enum PEER_CONNECTION_MODE {
  HOST = "HOST",
  SLAVE = "SLAVE",
}

const iceServers: RTCIceServer[] = [
  {
    urls: "stun:stun.l.google.com:19302",
  },
];

interface PeerConnectionContextValue {
  mode: PEER_CONNECTION_MODE | undefined;
  isConnected: boolean;
  localConnectionDescription: ConnectionDescription | undefined;
  startAsHost: () => void;
  closeConnectionAttempt: () => void;
  startAsSlave: (connectionDescription: ConnectionDescription) => void;
  setRemoteConnectionDescription: (
    connectionDescription: ConnectionDescription
  ) => void;
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

    setLocalDescription(btoa(peerConnectionRef.current.localDescription));
  }, [mode]);

  const startAsSlave = useCallback(
    async (connectionDescription: ConnectionDescription) => {
      if (mode) return;
      setMode(PEER_CONNECTION_MODE.SLAVE);

      peerConnectionRef.current = await createPeerConnection({
        iceServers,
        remoteDescription: btoa(connectionDescription.description),
        onMessageReceived,
        onChannelOpen,
      });

      setLocalDescription(btoa(peerConnectionRef.current.localDescription));
    },
    [mode]
  );

  const setRemoteConnectionDescription = useCallback(
    (connectionDescription: ConnectionDescription) => {
      peerConnectionRef.current?.setAnswerDescription(
        btoa(connectionDescription.description)
      );
    },
    []
  );

  const sendMessage = useCallback((message: unknown) => {
    if (!peerConnectionRef.current) return;
    const messageString = JSON.stringify(message);
    peerConnectionRef.current.sendMessage(messageString);
  }, []);

  const localConnectionDescription: ConnectionDescription | undefined =
    useMemo(() => {
      return localDescription
        ? {
            description: localDescription,
          }
        : undefined;
    }, [localDescription]);

  return (
    <PeerConnectionContext.Provider
      value={{
        mode,
        isConnected,
        localConnectionDescription,
        startAsHost,
        closeConnectionAttempt,
        startAsSlave,
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
    startAsSlave,
    setRemoteConnectionDescription,
    sendMessage,
  } = useContext(PeerConnectionContext);

  return {
    mode,
    isConnected,
    localConnectionDescription,
    startAsHost,
    closeConnectionAttempt,
    startAsSlave,
    setRemoteConnectionDescription,
    sendMessage: sendMessage as (message: T) => void,
  };
};
