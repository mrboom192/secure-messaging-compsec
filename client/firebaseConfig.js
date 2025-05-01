// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeya6eWv5A54GSfUL5-4p01_Dgv3bL3Tg",
  authDomain: "messaging-comp-sec.firebaseapp.com",
  projectId: "messaging-comp-sec",
  storageBucket: "messaging-comp-sec.firebasestorage.app",
  messagingSenderId: "322731988361",
  appId: "1:322731988361:web:9dcebf8d6703b35b75bd58",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Firestore and get a reference to the service
const db = getFirestore(app);

export { db };
