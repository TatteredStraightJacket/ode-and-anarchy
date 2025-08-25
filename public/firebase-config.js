// ✅ Cleaned up firebase-config.js (NEW FILE or replace old one)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBqnkXnAPzOhMb9O-Z6SsSJdKdutPl50BY",
  authDomain: "ode-and-anarchy.firebaseapp.com",
  projectId: "ode-and-anarchy",
  storageBucket: "ode-and-anarchy.appspot.com",
  messagingSenderId: "70787014804",
  appId: "1:70787014804:web:6eb9e97013afa9a66b5481"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };