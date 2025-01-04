import { GoogleAuthProvider, signInWithPopup, signOut} from "firebase/auth";
import { auth } from "./firebase";
import { addUserToFirestore } from "./firestoreUtils";

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await addUserToFirestore(user);

    console.log("User signed in:", user);
    return user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
}

export async function signOutUser(){
    try {
        await signOut(auth);
        console.log("User signed out successfully");
    } catch (error) {
        console.error("Error during sign-out:", error);
    }
}
