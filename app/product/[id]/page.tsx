"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

import { createOrGetChat } from "@/lib/chat";
import { Listing } from "@/types/listing";

export default function ProductScreen() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();

    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
        if (id && user) {
            const checkSavedStatus = async () => {
                const savedDocRef = doc(db, `users/${user.uid}/saved_items`, id);
                const savedDocSnap = await getDoc(savedDocRef);
                setIsSaved(savedDocSnap.exists());
            };
            checkSavedStatus();
        }
    }, [id, user]);

    const toggleSave = async () => {
        if (!user || !listing) return;

        try {
            const savedDocRef = doc(db, `users/${user.uid}/saved_items`, id);
            if (isSaved) {
                await deleteDoc(savedDocRef);
                setIsSaved(false);
            } else {
                await setDoc(savedDocRef, {
                    listingId: id,
                    savedAt: new Date()
                });
                setIsSaved(true);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const handleChat = async () => {
        if (!user) {
            // Redirect to login or show auth modal
            router.push("/(auth)/welcome");
            return;
        }

        if (!listing) return;

        if (user.uid === listing.sellerId) {
            alert("You cannot chat with yourself");
            return;
        }

        setChatLoading(true);
        try {
            // Create a composite name/image if needed, or just pass listing info
            const chat = await createOrGetChat(
                user.uid,
                listing.sellerId,
                listing.id,
                `${listing.brand} ${listing.model}`,
                listing.imageUrls[0]
            );

            router.push(`/chat?id=${chat.id}`);
        } catch (error) {
            console.error("Error initiating chat:", error);
            alert("Failed to start chat. Please try again.");
        } finally {
            setChatLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            const fetchListing = async () => {
                try {
                    const docRef = doc(db, "listings", id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        console.log(docSnap.data())
                        setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching listing:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchListing();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <p className="text-gray-500">Listing not found.</p>
            </div>
        );
    }

    return (
        <div className="relative max-w-md mx-auto min-h-screen w-full overflow-x-hidden bg-background-light dark:bg-background-dark">
            <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden pb-24">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined">
                            arrow_back_ios_new
                        </span>
                    </button>
                    <div className="flex items-center gap-3">
                        <button className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined">share</span>
                        </button>
                        <button onClick={toggleSave} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className={`material-symbols-outlined ${isSaved ? 'text-red-500 fill-current' : ''}`}>
                                {isSaved ? 'favorite' : 'favorite_border'}
                            </span>
                        </button>
                    </div>
                </div>
                {/* Main Hero Image Area */}
                <div className="w-full pt-20 px-4">
                    <div className="w-full aspect-4/3 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm relative group">
                        <div
                            className="w-full h-full bg-center bg-contain bg-no-repeat transition-all duration-300"
                            style={{
                                backgroundImage: `url("${listing.imageUrls[selectedImageIndex]}")`,
                            }}
                        ></div>
                        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">
                            {selectedImageIndex + 1}/{listing.imageUrls.length}
                        </div>
                    </div>
                </div>

                {/* Thumbnail Carousel */}
                {listing.imageUrls.length > 1 && (
                    <div className="w-full overflow-x-auto no-scrollbar px-4 py-4">
                        <div className="flex flex-row items-start justify-start gap-3 w-max">
                            {listing.imageUrls.map((url, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex flex-col justify-center gap-2 w-20 cursor-pointer transition-opacity ${selectedImageIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    <div
                                        className={`w-full aspect-square bg-center bg-cover rounded-lg border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                        style={{ backgroundImage: `url("${url}")` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Product Info */}
                <div className="px-4 mt-4">
                    <div className="flex justify-between items-start gap-4">
                        <h1 className="text-[#0d121b] dark:text-white tracking-tight text-2xl font-bold leading-tight flex-1">
                            {listing.brand} {listing.model}
                        </h1>
                        <h2 className="text-primary tracking-tight text-2xl font-bold leading-tight">
                            ${listing.price}
                        </h2>
                    </div>
                    {/* Chips */}
                    <div className="flex gap-2 py-4 flex-wrap">
                        <div className="flex h-8 shrink-0 items-center justify-center gap-x-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 pl-2 pr-3">
                            <span className="material-symbols-outlined text-green-700 dark:text-green-400 text-[18px]">
                                verified
                            </span>
                            <p className="text-green-800 dark:text-green-300 text-xs font-semibold leading-normal">
                                {listing.condition}
                            </p>
                        </div>
                        <div className="flex h-8 shrink-0 items-center justify-center gap-x-1.5 rounded-lg bg-[#e7ebf3] dark:bg-slate-800 pl-2 pr-3">
                            <span className="material-symbols-outlined text-[#0d121b] dark:text-slate-300 text-[18px]">
                                lock_open
                            </span>
                            <p className="text-[#0d121b] dark:text-slate-300 text-xs font-medium leading-normal">
                                Unlocked
                            </p>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-200 dark:bg-gray-700 mx-4 my-2" />
                {/* Seller Card */}
                <div className="px-4 py-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Seller Information
                    </h3>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="size-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-bold">
                                    {listing.sellerName ? listing.sellerName[0].toUpperCase() : 'U'}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-primary aspect-square w-8 h-8 text-white rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                                    <span className="material-symbols-outlined text-[12px] ">
                                        check
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[#0d121b] dark:text-white font-bold text-base leading-tight">
                                    {listing.sellerName || 'Unknown Seller'}
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="material-symbols-outlined text-yellow-500 text-[16px] fill-current">
                                        star
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        4.9
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Specifications Grid */}
                <div className="px-4 py-2">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Device Specs
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Color
                            </span>
                            <span className="text-sm font-semibold text-[#0d121b] dark:text-white">
                                {listing.color}
                            </span>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Storage
                            </span>
                            <span className="text-sm font-semibold text-[#0d121b] dark:text-white">
                                {listing.storage}
                            </span>
                        </div>
                        {/* <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Box
                            </span>
                            <span className="text-sm font-semibold text-[#0d121b] dark:text-white">
                                Included
                            </span>
                        </div> */}
                    </div>
                </div>
                {/* Description */}
                <div className="px-4 py-4">
                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        Description
                    </h3>
                    <p className="text-[#0d121b] dark:text-gray-300 text-sm leading-relaxed">
                        {listing.description}
                    </p>
                </div>

                {/* Safety Disclaimer */}
                <div className="px-4 py-4 mb-4 flex justify-center">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <span className="material-symbols-outlined text-[12px]">
                            shield
                        </span>
                        <span className="text-xs font-medium">
                            Safety Tips for Meeting Sellers
                        </span>
                    </div>
                </div>
            </div>
            {/* Sticky Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-background-light/95 dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
                <div className="flex gap-3 max-w-2xl mx-auto">
                    <button
                        onClick={handleChat}
                        disabled={chatLoading}
                        className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary/10 dark:bg-white/10 text-primary dark:text-white font-bold text-base transition-colors hover:bg-primary/20 disabled:opacity-50"
                    >
                        {chatLoading ? (
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span className="material-symbols-outlined">chat_bubble</span>
                                Chat
                            </>
                        )}
                    </button>
                    <button className="flex-2 flex items-center justify-center h-12 rounded-xl bg-primary text-white font-bold text-base shadow-lg shadow-primary/30 transition-transform active:scale-[0.98]">
                        Buy Now for ₹{listing.price}
                    </button>
                </div>
            </div>
        </div>
    );
}
