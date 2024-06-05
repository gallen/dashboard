// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbazEgDc71cAmK_elpk3iNCnxBLYuTXy4",
  authDomain: "test-bf44c.firebaseapp.com",
  projectId: "test-bf44c",
  storageBucket: "test-bf44c.appspot.com",
  messagingSenderId: "618955419509",
  appId: "1:618955419509:web:883e0a30ecb408eed3ad3c"
};

// Initialize Firebase
const appHandle = initializeApp(firebaseConfig);
export const dbHandle = getFirestore(appHandle);