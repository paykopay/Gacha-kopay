// firebase.js

// Import dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase dari project kamu
const firebaseConfig = {
  apiKey: "AIzaSyCUyTpfHxyZKsOVS0VHDNU6grhDMZJ1JAs",
  authDomain: "coffee-spark-sample-app-af59a.firebaseapp.com",
  projectId: "coffee-spark-sample-app-af59a",
  storageBucket: "coffee-spark-sample-app-af59a.firebasestorage.app",
  messagingSenderId: "825413619404",
  appId: "1:825413619404:web:2678e6320d8f93bf76bc69"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Ekspor Firebase Auth dan Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };