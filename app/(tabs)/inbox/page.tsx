"use client";

import BottomNavbar from "@/components/BottomNavbar";
import { Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { subscribeToUserChats, type Chat } from "@/lib/chat";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ChatListItem = ({ chat, currentUserId }: { chat: Chat, currentUserId: string }) => {
  const router = useRouter();
  const [otherUser, setOtherUser] = useState<{ name: string, photo: string } | null>(null);

  useEffect(() => {
    const fetchOtherUser = async () => {
      const otherUserId = chat.participants.find(id => id !== currentUserId);
      if (otherUserId) {
        try {
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setOtherUser({
              name: userData.displayName || userData.name || userData.email || "User",
              photo: userData.photoURL || ""
            });
          }
        } catch (e) {
          console.error("Error fetching user", e);
        }
      }
    };
    fetchOtherUser();
  }, [chat.participants, currentUserId]);

  const otherUserName = otherUser?.name || "User";

  return (
    <div
      onClick={() => router.push(`/chat?id=${chat.id}`)}
      className="flex gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800 transition-colors items-center group"
    >
      <div className="relative shrink-0">
        <div
          className="h-14 w-14 rounded-full bg-cover bg-center border border-gray-100 dark:border-gray-700"
          style={{
            backgroundImage: otherUser?.photo ? `url("${otherUser.photo}")` : 'none',
            backgroundColor: '#cbd5e1'
          }}
        >
          {!otherUser?.photo && <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">{otherUserName[0]}</div>}
        </div>
        {chat.productImage && (
          <div
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-lg border-2px border-white dark:border-background-dark bg-cover bg-center shadow-sm"
            style={{
              backgroundImage: `url("${chat.productImage}")`,
            }}
          ></div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <p className="text-[#0d121b] dark:text-white text-base font-semibold leading-tight truncate pr-2">
            {otherUserName}
          </p>
          <p className="text-[#4c669a] dark:text-gray-500 text-xs font-normal shrink-0">
            {chat.lastMessageTime?.seconds
              ? new Date(chat.lastMessageTime.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </p>
        </div>
        <p className="text-xs text-primary font-medium mb-1 truncate">
          {chat.productName || 'Product Chat'}
        </p>
        <div className="flex justify-between items-center gap-2">
          <p className="text-[#0d121b] dark:text-gray-200 text-sm font-medium leading-normal truncate">
            {chat.lastMessage || 'No messages yet'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function InboxScreen() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToUserChats(user.uid, (data) => {
      setChats(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl">
      {/* Header */}
      <div className="flex items-center px-5 pt-6 pb-2 justify-between bg-background-light dark:bg-background-dark shrink-0">
        <h2 className="text-2xl font-bold leading-tight tracking-[-0.015em] flex-1">
          Messages
        </h2>
        <div className="flex items-center justify-end">
          <button className="flex items-center justify-center rounded-full h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-primary">
            <Edit onClick={()=> alert('Edit Chats - Not implemented yet')} size={22} />
          </button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="px-5 py-3 shrink-0 bg-background-light dark:bg-background-dark">
        <label className="flex flex-col w-full">
          <div className="flex w-full items-center rounded-xl h-12 bg-[#e7ebf3] dark:bg-gray-800 overflow-hidden transition-colors">
            <div className="text-[#4c669a] dark:text-gray-400 flex items-center justify-center pl-4 pr-2">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 24 }}
              >
                search
              </span>
            </div>
            <input
              className="flex w-full flex-1 border-none bg-transparent h-full placeholder:text-[#4c669a] dark:placeholder:text-gray-500 px-2 text-base font-normal focus:outline-none focus:ring-0 text-[#0d121b] dark:text-white"
              placeholder="Search by name or product"
              defaultValue=""
            />
          </div>
        </label>
      </div>
      {/* Tabs */}
      <div className="pb-2 shrink-0 bg-background-light dark:bg-background-dark">
        <div className="flex border-b border-[#cfd7e7] dark:border-gray-700 px-5 justify-between gap-4">
          <a className="flex flex-col items-center justify-center border-b-[3px] border-b-primary text-primary pb-3 pt-2 flex-1 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-t-lg">
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              All
            </p>
          </a>
          <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c669a] dark:text-gray-400 pb-3 pt-2 flex-1 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Buying
            </p>
          </a>
          <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4c669a] dark:text-gray-400 pb-3 pt-2 flex-1 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            <p className="text-sm font-bold leading-normal tracking-[0.015em]">
              Selling
            </p>
          </a>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500">No messages yet.</p>
            <p className="text-sm text-gray-400 mt-2">Start chatting with sellers from their product pages.</p>
          </div>
        ) : (
          user && chats.map(chat => (
            <ChatListItem key={chat.id} chat={chat} currentUserId={user.uid} />
          ))
        )}

        {/* Empty space for scrolling above nav */}
        <div className="h-20" />
      </div>
    </div>
  );
}
