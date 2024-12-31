import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCXY_vzj484DjswNDpwgb6j6u8B6ppsAyw",
  authDomain: "ai-app-ec887.firebaseapp.com",
  projectId: "ai-app-ec887",
  storageBucket: "ai-app-ec887.firebasestorage.app",
  messagingSenderId: "691425653773",
  appId: "1:691425653773:web:f03a8ae149c0e4f3235144"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user; 
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
  } catch (error) {
    console.error("Error during sign-out:", error);
    throw error;
  }
};