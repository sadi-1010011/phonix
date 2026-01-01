"use client";

import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

interface Listing {
  id: string;
  brand: string;
  model: string;
  condition: string;
  price: number;
  imageUrls: string[];
  storage: string;
  color: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Listing[];
      setListings(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredListings = listings.filter((item) => {
    const searchLower = searchText.toLowerCase();
    return (
      item.model.toLowerCase().includes(searchLower) ||
      item.brand.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="relative flex h-full max-w-md mx-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden group/design-root">
      <div className="bg-background-light dark:bg-background-dark z-20 shrink-0 sticky top-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex flex-col">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
              Explore
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Find the perfect device
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="material-symbols-outlined">shopping_cart</span>
            </button>
          </div>
        </div>
        {/* Search Bar */}
        <div className="px-4 py-2">
          <label className="flex flex-col h-12 w-full">
            <div className="flex w-full flex-1 items-center rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors focus-within:border-primary/50">
              <div className="pl-4 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 bg-transparent border-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 text-sm font-medium focus:ring-0"
                placeholder="Search iPhone 14, Galaxy S23..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button className="pr-4 text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: '"FILL" 1' }}
                >
                  tune
                </span>
              </button>
            </div>
          </label>
        </div>
        {/* Categories Chips */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto hide-scrollbar snap-x no-scrollbar">
          {["All Phones", "Apple", "Samsung", "Google", "Under $300"].map(cat => (
            <button key={cat} onClick={() => setSearchText(cat === "All Phones" ? "" : cat === "Under $300" ? "" : cat)} className="snap-start shrink-0 flex items-center justify-center px-4 h-9 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-sm font-medium whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              {cat}
            </button>
          ))}
        </div>
        {/* Separator Gradient */}
        <div className="h-4 bg-linear-to-b from-background-light to-transparent dark:from-background-dark pointer-events-none absolute -bottom-4 left-0 right-0 w-full z-10" />
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-1 hide-scrollbar">
        {/* Filter & Sort Results Header */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <p className="text-gray-900 dark:text-white text-sm font-bold">
            {filteredListings.length} Results
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 gap-4">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                onClick={() => router.push(`/product/${item.id}`)}
                className="group relative flex flex-col gap-2 rounded-xl bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-transform duration-200 cursor-pointer"
              >
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url("${item.imageUrls[0] || 'https://via.placeholder.com/150'}")`,
                    }}
                  />
                  <div className="absolute left-2 bottom-2 rounded bg-black/70 px-1.5 py-0.5 backdrop-blur-md">
                    <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                      {item.condition}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 px-1 pb-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                      {item.model}
                    </h3>
                  </div>
                  <p className="font-display text-xs font-medium text-gray-500 dark:text-gray-400 line-clamp-1">
                    {item.storage} • {item.color}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="font-display text-base font-bold text-primary">
                      ${item.price}
                    </span>
                    <span className="rounded bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                      VERIFIED
                    </span>
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