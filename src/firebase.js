// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDToTxmPDo_tMG6t9DMbmJmZhQG7CRsnLo",
  authDomain: "lambdagolf-63ad1.firebaseapp.com",
  projectId: "lambdagolf-63ad1",
  storageBucket: "lambdagolf-63ad1.firebasestorage.app",
  messagingSenderId: "567793587816",
  appId: "1:567793587816:web:c51563ff95cc2747c70ddd",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
