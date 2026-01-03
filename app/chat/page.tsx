"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    getChatDetails,
    subscribeToMessages,
    sendMessage,
    type Message,
    type Chat
} from "@/lib/chat";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatScreen() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const chatId = searchParams?.get("id");
    const { user } = useAuth();

    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [otherUser, setOtherUser] = useState<{ name: string, photo: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch Chat Details
    useEffect(() => {
        if (!chatId || !user) return;

        const loadChat = async () => {
            try {
                const chatData = await getChatDetails(chatId);
                if (chatData) {
                    setChat(chatData);

                    // Identify other user
                    const otherUserId = chatData.participants.find(p => p !== user.uid);
                    if (otherUserId) {
                        const userDoc = await getDoc(doc(db, "users", otherUserId));
                        if (userDoc.exists()) {
                            const userData = userDoc.data();
                            // console.log(userData)
                            setOtherUser({
                                name: userData.displayName || userData.name || userData.email || "User",
                                photo: userData.photoURL || ""
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading chat:", error);
            } finally {
                setLoading(false);
            }
        };

        loadChat();
    }, [chatId, user]);

    // Subscribe to Messages
    useEffect(() => {
        if (!chatId) return;

        const unsubscribe = subscribeToMessages(chatId, (newMessages) => {
            setMessages(newMessages);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !user || !chatId) return;

        try {
            const text = inputMessage;
            setInputMessage(""); // Optimistic clear
            await sendMessage(chatId, text, user.uid);
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!chat || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <p className="text-gray-500">Chat not found.</p>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display max-w-md mx-auto text-slate-900 dark:text-white h-screen flex flex-col overflow-hidden">
            {/* Header Section */}
            <header className="flex-none bg-white dark:bg-slate-900 shadow-sm z-20">
                {/* Top Navigation */}
                <div className="flex items-center justify-between px-4 py-3">
                    <button onClick={() => router.back()} className="flex items-center justify-center p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div className="flex flex-col items-center">
                        <h1 className="text-base font-bold leading-tight">{otherUser?.name || 'Chat'}</h1>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                Online now
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center justify-center p-2 -mr-2 rounded-full text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
                {/* Product Context Bar */}
                {chat.productName && (
                    <div className="px-4 pb-3">
                        <div
                            onClick={() => chat.productId && router.push(`/product/${chat.productId}`)}
                            className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            <div
                                className="w-12 h-12 shrink-0 bg-center bg-cover rounded-md bg-slate-200"
                                style={{
                                    backgroundImage: chat.productImage ? `url("${chat.productImage}")` : 'none'
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-slate-900 dark:text-white">
                                    {chat.productName}
                                </p>
                            </div>
                            <div className="flex items-center text-primary text-sm font-semibold whitespace-nowrap px-2">
                                View Item
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Chat Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide bg-background-light dark:bg-background-dark">
                {/* Safety Banner */}
                <div className="flex justify-center">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg text-xs font-medium text-center max-w-xs border border-yellow-100 dark:border-yellow-900/30">
                        <span className="flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">shield</span>
                            For your safety, keep all transactions within the app.
                        </span>
                    </div>
                </div>

                {/* Messages */}
                {messages.map((msg) => {
                    const isMe = msg.senderId === user.uid;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'flex-col items-end ml-auto' : 'items-end gap-2'} max-w-[85%]`}>
                            {!isMe && (
                                <div
                                    className="w-8 h-8 rounded-full bg-cover bg-center shrink-0 border border-slate-200 dark:border-slate-700"
                                    style={{
                                        backgroundImage: otherUser?.photo ? `url("${otherUser.photo}")` : 'none',
                                        backgroundColor: '#cbd5e1'
                                    }}
                                >
                                    {!otherUser?.photo && <span className="flex w-full h-full items-center justify-center text-xs font-bold text-slate-500">{otherUser?.name?.[0]}</span>}
                                </div>
                            )}

                            <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : ''}`}>
                                <div className={`${isMe ? 'bg-primary text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700'} px-4 py-3 rounded-2xl shadow-sm`}>
                                    <p className="text-sm leading-relaxed">
                                        {msg.text}
                                    </p>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Bottom Input Section */}
            <footer className="flex-none bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 pb-safe">
                {/* Input Field */}
                <div className="p-3 flex items-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-slate-50 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined block">add_circle</span>
                    </button>
                    <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center min-h-[44px] px-4 py-2">
                        <input
                            className="w-full bg-transparent border-none p-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-0"
                            placeholder="Type a message..."
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                        />
                    </div>
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim()}
                        className="p-2 bg-primary text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center h-[44px] w-[44px] disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[20px] block ml-0.5">
                            send
                        </span>
                    </button>
                </div>
                {/* Safe area padding for iPhone Home Indicator */}
                <div className="h-4 w-full bg-white dark:bg-slate-900" />
            </footer>
        </div>
    );
}