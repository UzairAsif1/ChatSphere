import { doc, setDoc, getDoc, updateDoc, deleteDoc, arrayUnion, collection, addDoc, query, where, getDocs, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export async function addUserToFirestore(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        userId: user.uid,
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL || null,
        friends: [],
        status: "Available",
      });
      console.log("User added to Firestore");
    } else {
      console.log("User already exists in Firestore");
    }
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
}

export async function addFriend(currentUserId, friendEmail) {
  try {
    const usersRef = doc(db, "users", friendEmail);
    const friendSnap = await getDoc(usersRef);

    if (!friendSnap.exists()) {
      console.error("Friend not found");
      return;
    }

    const friendId = friendSnap.data().userId;

    const currentUserRef = doc(db, "users", currentUserId);
    await updateDoc(currentUserRef, {
      friends: arrayUnion(friendId),
    });

    const friendRef = doc(db, "users", friendId);
    await updateDoc(friendRef, {
      friends: arrayUnion(currentUserId),
    });

    console.log("Friend added successfully");
  } catch (error) {
    console.error("Error adding friend:", error);
  }
}

export async function getUserDetails(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.error("User not found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
}

export async function createChat(participants, isGroup = false) {
  try {
    console.log("Creating chat with participants:", participants, "Is group:", isGroup);

    const chatsRef = collection(db, "chats");

    if (!isGroup) {
      console.log("Checking for existing one-on-one chat...");
      const q = query(
        chatsRef,
        where("isGroup", "==", false),
        where("participants", "array-contains", participants[0])
      );
      const querySnapshot = await getDocs(q);

      console.log("Query snapshot size:", querySnapshot.size);
      const existingChat = querySnapshot.docs.find((doc) =>
        doc.data().participants.includes(participants[1])
      );

      if (existingChat) {
        console.log("Existing chat found with ID:", existingChat.id);
        return existingChat.id;
      }

      console.log("No existing chat found. Creating a new chat...");
    }

    const newChat = await addDoc(chatsRef, {
      participants,
      isGroup,
      lastMessage: "",
      lastMessageTimestamp: null,
    });

    console.log("New chat created with ID:", newChat.id);
    return newChat.id;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}


export async function sendMessage(chatId, senderId, messageText) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");

    await addDoc(messagesRef, {
      senderId,
      messageText,
      timestamp: serverTimestamp(),
      isRead: false,
    });

    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

export function listenToUserChats(userId, callback) {
  const chatsRef = collection(db, "chats");

  const q = query(chatsRef, where("participants", "array-contains", userId));

  onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(chats);
  });
}

export function listenToMessages(chatId, callback) {
  const messagesRef = collection(db, "chats", chatId, "messages");

  const q = query(messagesRef, orderBy("timestamp"));

  onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
}

export async function deleteChat(chatId) {
  try {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const messagesSnapshot = await getDocs(messagesRef);
    messagesSnapshot.forEach(async (messageDoc) => {
      await deleteDoc(doc(db, "chats", chatId, "messages", messageDoc.id));
    });

    await deleteDoc(doc(db, "chats", chatId));
    console.log("Chat deleted successfully");
  } catch (error) {
    console.error("Error deleting chat:", error);
  }
}


