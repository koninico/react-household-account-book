// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDm7Vz_I432g7gTgN6s9MqTj6YVZS8B5vg",
  authDomain: "householdtypescript-ce387.firebaseapp.com",
  projectId: "householdtypescript-ce387",
  storageBucket: "householdtypescript-ce387.firebasestorage.app",
  messagingSenderId: "826549770311",
  appId: "1:826549770311:web:94ee3f28013f867a09b962"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };