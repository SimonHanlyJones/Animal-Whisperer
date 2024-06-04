// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

// New Modular imports
import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import firebaseConfig from "./firebaseConfig";
import { connectFunctionsEmulator } from "firebase/functions";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const functions = getFunctions(app);
export const animalChat = httpsCallable(functions, "animalChat");

// const db = getFirestore(app); // Initialize Firestore
// const auth = getAuth(app); // Initialize Firebase Auth
