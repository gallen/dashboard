// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBm_40bOk1bKXk0CWdTod4mYnIU2JXHW4",
  authDomain: "realestate-e7335.firebaseapp.com",
  projectId: "realestate-e7335",
  storageBucket: "realestate-e7335.appspot.com",
  messagingSenderId: "933450473343",
  appId: "1:933450473343:web:15687255b4a3312623c44a",
  measurementId: "G-KJX9DY156D"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const dbHandle = getFirestore(app);
export const storageHandle = getStorage();