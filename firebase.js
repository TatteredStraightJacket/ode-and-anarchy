// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config (from Firebase Console > Project settings)
const firebaseConfig = {
  apiKey: "AIzaSyBqnkXnAPzOhMb9O-Z6SsSJdKdutPl50BY",
  authDomain: "ode-and-anarchy.firebaseapp.com",
  projectId: "ode-and-anarchy",
  storageBucket: "ode-and-anarchy.firebasestorage.app",
  messagingSenderId: "70787014804",
  appId: "1:70787014804:web:6eb9e97013afa9a66b5481"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

export { db };
