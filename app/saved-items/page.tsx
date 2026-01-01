"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Listing {
    id: string;
    brand: string;
    model: string;
    condition: string;
    storage: string;
    color: string;
    price: number;
    imageUrls: string[];
}

export default function SavedItemsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchSavedListings = async () => {
                try {
                    const savedRef = collection(db, `users/${user.uid}/saved_items`);
                    const savedSnap = await getDocs(savedRef);

                    if (savedSnap.empty) {
                        setListings([]);
                        setLoading(false);
                        return;
                    }

                    const listingPromises = savedSnap.docs.map(async (savedDoc) => {
                        const listingId = savedDoc.data().listingId || savedDoc.id; // Fallback to doc ID if listingId not set
                        const listingRef = doc(db, "listings", listingId);
                        const listingSnap = await getDoc(listingRef);
                        if (listingSnap.exists()) {
                            return { id: listingSnap.id, ...listingSnap.data() } as Listing;
                        }
                        return null;
                    });

                    const listingsResult = await Promise.all(listingPromises);
                    const validListings = listingsResult.filter((item): item is Listing => item !== null);

                    setListings(validListings);

                } catch (error) {
                    console.error("Error fetching saved listings:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchSavedListings();
        }
    }, [user]);

    return (
        <ProtectedRoute>
            <div className="relative h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark border-x dark:border-slate-800 shadow-xl">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-xl font-bold tracking-tight text-center flex-1 pr-10">
                        Saved Items
                    </h2>
                </header>

                <div className="p-4 flex flex-col gap-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            You haven't saved any items yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {listings.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => router.push(`/product/${item.id}`)}
                                    className="bg-surface-light dark:bg-surface-dark rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col gap-3 group cursor-pointer"
                                >
                                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                                            style={{
                                                backgroundImage: `url("${item.imageUrls[0] || 'https://via.placeholder.com/300'}")`,
                                            }}
                                        ></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                                                {item.condition}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-text-main-light dark:text-text-main-dark leading-snug line-clamp-1">
                                            {item.model}
                                        </h3>
                                        <p className="text-xs text-text-sec-light dark:text-text-sec-dark mt-0.5">
                                            {item.storage} • {item.color}
                                        </p>
                                        <div className="mt-2 flex items-end justify-between">
                                            <span className="text-base font-bold text-text-main-light dark:text-text-main-dark">
                                                ${item.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
