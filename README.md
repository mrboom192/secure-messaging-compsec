Authors: Victoria Rowe, Cristiana Eagen, Jason Nguyen

Overview: This is a secure, peer-to-peer (P2P) instant messaging app built using WebRTC and AES-256-GCM encryption. Users can chat in real time using a shared password for end-to-end encrypted communication. You can try out the demo here: [secure-messaging](https://secure-messaging.netlify.app/)

Features:
Peer-to-peer messaging using WebRTC (no central server)
AES-256-GCM encryption for secure communication
Shared password-based key derivation
Simple GUI with chat and connection interface
Random IV for each message (prevents repeated ciphertext)

Getting Started:
Prerequisites: Node.js installed on your machine
Installation: Clone the repository:
git clone <https://github.com/mrboom192/secure-messaging-compsec.git>
cd <project-folder>
Install dependencies: npm install
Run the app: npm run dev
Open your browser and go to the link that was given after you did "npm run dev"

Usage:
On one device, click "Host Chat" to generate the SDP offer.
Share the offer with the second device.
On the second device, click "Join Chat" and paste the offer.
Paste the answer back into the first device and click "Connect".
Enter a shared password and start chatting securely.
