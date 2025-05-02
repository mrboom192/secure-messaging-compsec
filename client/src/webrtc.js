const CHANNEL_LABEL = "P2P_CHAT"; // The label for the data channel

const servers = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

let pc = new RTCPeerConnection(servers);
let dataChannel = pc.createDataChannel(CHANNEL_LABEL, { reliable: true });

dataChannel.onerror = function (err) {
  console.log("Error:", err);
};

dataChannel.onmessage = function (event) {
  console.log("Message from DataChannel:", event.data);
  // Handle incoming messages here
};

dataChannel.send("Hello from the other side!"); // Send a message to the other peer
