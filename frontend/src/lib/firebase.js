import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbI2TGMX2Ic87e7woCNtzh3_9xDTthTj4",
  authDomain: "taxi-85d92.firebaseapp.com",
  databaseURL: "https://taxi-85d92-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taxi-85d92",
  storageBucket: "taxi-85d92.firebasestorage.app",
  messagingSenderId: "148798161471",
  appId: "1:148798161471:web:81221394877e182ca7ee8a",
  measurementId: "G-1MRWWY593T"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);