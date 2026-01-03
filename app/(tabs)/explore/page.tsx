"use client";

import { Bell, Eye, Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

interface Listing {
  id: string;
  brand: string;
  model: string;
  condition: string;
  storage: string;
  color: string;
  price: number;
  imageUrls: string[];
  createdAt: any;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const listingData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Listing[];
      setListings(listingData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching listings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 max-w-md mx-auto shadow-2xl">
      {/* TopAppBar */}
      <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b-0 border-gray-200 dark:border-gray-800">
        <div className="flex items-center p-4 pb-2 justify-between">
          {/* User Profile */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary p-0.5 cursor-pointer hover:opacity-80 transition-opacity">
            <div
              onClick={() => router.push('/profile')}
              className="bg-center bg-no-repeat w-full h-full bg-cover rounded-full"
              data-alt="User profile"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-kuZROwrtLAqNR7XK5oaN2yRd8-91IkrIqZt1IlERRFrBWfpWbmEhDmpwfm09ZqpgEZPLMKMGdkp-5k9j6oOV6aA2TRFxQ9x52U98KdUHOo0623TXJFxFnh_DjuxxnlslJ6cRBVHpFKd--96uZhTs9tnl9HLw6uLr10z7F4THdBC_aRaPVDcfK7I_sz85zIlDVUJimdwERhjTYT_6MbfGSCxJv2V7SNKruuxbUyD4i6YdVO8_qFs22Zs-QSkqa52SNQ1hC3LI5I0")',
              }}
            ></div>
          </div>
          {/* App Title */}
          <div className="flex flex-col items-center">
            <h1 className="text-primary text-xl font-bold tracking-tight">
              Phonix
            </h1>
            <span className="text-[10px] font-medium text-text-sec-light dark:text-text-sec-dark uppercase tracking-widest">
              Marketplace
            </span>
          </div>
          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => router.push('/notifications')} className="relative flex items-center justify-center text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors">
              <Bell strokeWidth={1.5} />
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-background-dark" />
            </button>
            <button onClick={() => router.push('/saved-items')} className="flex items-center justify-center text-text-main-light dark:text-text-main-dark hover:text-primary transition-colors">
              <ShoppingBag className="text-[26px]" strokeWidth={1} />
            </button>
          </div>
        </div>
      </header>

      {/* SearchBar */}
      <div className="px-4 py-4 sticky top-17.5 z-40 bg-background-light dark:bg-background-dark">
        <div className="flex gap-3">
          <label className="flex flex-col h-12 w-full flex-1">
            <div className="flex w-full flex-1 items-stretch rounded-xl h-full shadow-sm bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
              <div className="text-text-sec-light dark:text-text-sec-dark flex items-center justify-center pl-4 pr-2">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-xl bg-transparent text-text-main-light dark:text-text-main-dark placeholder:text-text-sec-light dark:placeholder:text-text-sec-dark px-2 text-base font-normal focus:outline-0 border-none focus:ring-0 h-full"
                placeholder="Search iPhone 14, S23 Ultra..."
              />
            </div>
          </label>
        </div>
      </div>

      {/* Explore Grid */}
      <div className="flex flex-col w-full px-4 pt-4 pb-20">
        <h2 className="text-xl font-bold text-text-main-light dark:text-text-main-dark leading-tight mb-4">
          Fresh Listings
        </h2>
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No listings found. Be the first to sell!
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
                  <div className="absolute bottom-0 w-full bg-linear-to-t from-black/60 to-transparent p-2">
                    <span className="text-[10px] text-white font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      {formatTimeAgo(item.createdAt?.toDate())}
                    </span>
                  </div>
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
                      ₹{item.price}
                    </span>
                    <button className="text-text-sec-light hover:text-primary transition-colors">
                      <Eye className="size-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
