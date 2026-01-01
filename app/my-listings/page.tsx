"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, Edit2, Trash2 } from "lucide-react";
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

export default function MyListingsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchListings = async () => {
                try {
                    const q = query(collection(db, "listings"), where("sellerId", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const listingData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as Listing[];
                    setListings(listingData);
                } catch (error) {
                    console.error("Error fetching listings:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchListings();
        }
    }, [user]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this listing?")) {
            try {
                await deleteDoc(doc(db, "listings", id));
                setListings(listings.filter((item) => item.id !== id));
            } catch (error) {
                console.error("Error deleting listing:", error);
                alert("Failed to delete listing.");
            }
        }
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/edit/${id}`);
    };

    return (
        <ProtectedRoute>
            <div className="relative h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark border-x dark:border-slate-800 shadow-xl">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center gap-3">
                    <button onClick={() => router.back()} className="flex size-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm text-slate-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined">arrow_back_ios_new</span>
                    </button>
                    <h2 className="text-xl font-bold tracking-tight text-center flex-1 pr-10">
                        My Active Listings
                    </h2>
                </header>

                <div className="p-4 flex flex-col gap-4">
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : listings.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            You don't have any active listings.
                        </div>
                    ) : (
                        listings.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => router.push(`/product/${item.id}`)}
                                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 group cursor-pointer"
                            >
                                <div className="flex p-3 gap-3">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                                        <img
                                            src={item.imageUrls[0] || 'https://via.placeholder.com/150'}
                                            alt={item.model}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-base font-semibold text-slate-900 dark:text-white line-clamp-1">
                                                    {item.brand} {item.model}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {item.storage} • {item.color}
                                            </p>
                                            <span className="inline-block mt-1 text-[10px] font-bold text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded">
                                                {item.condition}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end mt-2">
                                            <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                ${item.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/* Action Footer */}
                                <div className="border-t border-slate-100 dark:border-slate-700 p-2 flex divide-x divide-slate-100 dark:divide-slate-700">
                                    <button
                                        onClick={(e) => handleEdit(item.id, e)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
