
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  serverTimestamp,
  updateDoc,
  Timestamp,
  limit
} from "firebase/firestore";

// Interface Definitions
export interface Message {
  id?: string;
  text: string;
  senderId: string;
  createdAt: Timestamp | any;
  imageUrl?: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  participantIds: string[]; // For array-contains queries
  productId?: string;
  lastMessage: string;
  lastMessageTime: Timestamp | any;
  updatedAt: Timestamp | any;
  productName?: string;
  productImage?: string;
}

// Create or Get Existing Chat
export const createOrGetChat = async (
  currentUserId: string,
  otherUserId: string,
  productId?: string,
  productName?: string,
  productImage?: string
) => {
  // Check if chat already exists
  // Note: Firestore doesn't support array-contains for multiple values in a single query easily without composite indexes
  // So we might need to query for one user and filter in client or use a generated ID like `minId_maxId`
  
  // Strategy: Unique ID based on sorted user IDs + Product ID combined
  // This ensures unique chat per buyer-seller-product combo
  const sortedIds = [currentUserId, otherUserId].sort();
  const chatId = productId 
    ? `${sortedIds[0]}_${sortedIds[1]}_${productId}`
    : `${sortedIds[0]}_${sortedIds[1]}`;

  const chatDocRef = doc(db, "chats", chatId);
  const chatDoc = await getDoc(chatDocRef);

  if (chatDoc.exists()) {
    return { id: chatDoc.id, ...chatDoc.data() } as Chat;
  }

  // Create new chat
  const newChatData = {
    participants: [currentUserId, otherUserId], // array for security rules if needed
    participantIds: [currentUserId, otherUserId], // duplicate for queries
    productId: productId || null,
    productName: productName || null,
    productImage: productImage || null,
    lastMessage: "",
    lastMessageTime: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  await setDoc(chatDocRef, newChatData);
  return { id: chatId, ...newChatData } as Chat;
};

// Ensure we import setDoc
import { setDoc } from "firebase/firestore";


// Send Message
export const sendMessage = async (chatId: string, text: string, senderId: string, imageUrl?: string) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  
  await addDoc(messagesRef, {
    text,
    senderId,
    createdAt: serverTimestamp(),
    read: false,
    imageUrl: imageUrl || null
  });

  // Update last message in chat
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: text || (imageUrl ? "Sent an image" : ""),
    lastMessageTime: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

// Subscribe to Messages
export const subscribeToMessages = (chatId: string, callback: (messages: Message[]) => void) => {
  const messagesRef = collection(db, "chats", chatId, "messages");
  const q = query(messagesRef, orderBy("createdAt", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Message[];
    callback(messages);
  });
};

// Get User Chats (Inbox)
export const subscribeToUserChats = (userId: string, callback: (chats: Chat[]) => void) => {
  const chatsRef = collection(db, "chats");
  // Query where participantIds array contains userId
  const q = query(chatsRef, where("participantIds", "array-contains", userId), orderBy("updatedAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Chat[];
    callback(chats);
  });
};

// Get Single Chat
export const getChatDetails = async (chatId: string) => {
    const chatDoc = await getDoc(doc(db, "chats", chatId));
    if (chatDoc.exists()) {
        return { id: chatDoc.id, ...chatDoc.data() } as Chat;
    }
    return null;
}
