/* eslint-disable @typescript-eslint/no-use-before-define */
const CHANNEL_LABEL = "P2P_CHAT_CHANNEL_LABEL"; // The label for the data channel

export interface CreatePeerConnectionProps {
  remoteDescription?: string;
  iceServers?: RTCIceServer[];
  onChannelOpen: () => any;
  onMessageReceived: (message: string) => any;
}

export interface CreatePeerConnectionResponse {
  localDescription: string;
  setAnswerDescription: (answerDescription: string) => void;
  sendMessage: (message: string) => void;
}

export function createPeerConnection({
  remoteDescription,
  iceServers = [],
  onChannelOpen,
  onMessageReceived,
}: CreatePeerConnectionProps): Promise<CreatePeerConnectionResponse> {
  // Create a new RTCPeerConnection instance
  const peerConnection = new RTCPeerConnection({
    iceServers,
  });

  // Set up the ICE candidate handler
  let channelInstance: RTCDataChannel;

  // Set up the data channel as a host
  function setupChannelAsAHost() {
    try {
      // Create a data channel
      channelInstance = peerConnection.createDataChannel(CHANNEL_LABEL);

      // Set up the data channel event handlers
      channelInstance.onopen = function () {
        onChannelOpen();
      };

      channelInstance.onmessage = function (event) {
        onMessageReceived(event.data);
      };
    } catch (e) {
      console.error("No data channel (peerConnection)", e);
    }
  }

  // Create an offer and set it as the local description
  async function createOffer() {
    const description = await peerConnection.createOffer();
    peerConnection.setLocalDescription(description);
  }

  // Set up the data channel
  function setupChannelAsASlave() {
    peerConnection.ondatachannel = function ({ channel }) {
      channelInstance = channel;
      channelInstance.onopen = function () {
        onChannelOpen();
      };

      channelInstance.onmessage = function (event) {
        onMessageReceived(event.data);
      };
    };
  }

  // Create an answer and set it as the local description
  async function createAnswer(remoteDescription: string) {
    await peerConnection.setRemoteDescription(JSON.parse(remoteDescription));
    const description = await peerConnection.createAnswer();
    peerConnection.setLocalDescription(description);
  }

  function setAnswerDescription(answerDescription: string) {
    peerConnection.setRemoteDescription(JSON.parse(answerDescription));
  }

  function sendMessage(message: string) {
    if (channelInstance) {
      channelInstance.send(message);
    }
  }

  return new Promise((res) => {
    peerConnection.onicecandidate = function (e) {
      if (e.candidate === null && peerConnection.localDescription) {
        peerConnection.localDescription.sdp.replace("b=AS:30", "b=AS:1638400");
        res({
          localDescription: JSON.stringify(peerConnection.localDescription),
          setAnswerDescription,
          sendMessage,
        });
      }
    };

    if (!remoteDescription) {
      setupChannelAsAHost();
      createOffer();
    } else {
      setupChannelAsASlave();
      createAnswer(remoteDescription);
    }
  });
}
