"use client";

import { Bell, ChevronRight, CreditCard, Edit3, Heart, HelpCircle, LucideLocationEdit, Moon, NotebookPen, Package, Rainbow, Settings, ShoppingBag, Store, Truck, Verified, Wallet } from "lucide-react";

import { Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    locality: "",
    photoURL: "",
    createdAt: null as any,
  });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfileData(docSnap.data() as any);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const memberSince = profileData.createdAt
    ? new Date(profileData.createdAt.seconds * 1000).getFullYear()
    : new Date().getFullYear();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark border-x dark:border-slate-800 shadow-xl">
      {/* Top App Bar */}
      <header className="sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-center flex-1">
          Profile
        </h2>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="absolute right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      {/* Profile Header */}
      <section className="flex flex-col items-center pt-8 pb-6 px-4 bg-background-light dark:bg-background-dark">
        <div className="relative">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full h-28 w-28 border-4 border-white dark:border-slate-700 shadow-md bg-gray-200"
            style={{
              backgroundImage: `url("${profileData.photoURL || 'https://via.placeholder.com/150'}")`,
            }}
          ></div>
          <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
            <Verified />
          </div>
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {profileData.name || "User"}
          </h1>
          {profileData.locality && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {profileData.locality}
            </p>
          )}
          <div className="flex items-center justify-center gap-2 mt-1 text-slate-500 dark:text-slate-400 text-sm">
            <span>Member since {memberSince}</span>
            {/* <span className="w-1 h-1 rounded-full bg-slate-400" /> */}
            {/* <span className="flex items-center text-amber-500 font-semibold">
              4.9{" "}
              <span className="material-symbols-outlined text-[14px] ml-0.5 fill-current">
                star
              </span>
            </span>
            <span className="text-slate-400">(0)</span> */}
          </div>
        </div>
        <button onClick={() => router.push('/edit/profile')} className="mt-5 w-full max-w-50 h-10 rounded-lg bg-primary text-white text-sm font-semibold shadow-sm hover:bg-blue-600 active:scale-95 transition-all flex items-center justify-center gap-2">
          <Edit3 size={14} />
          Edit Profile
        </button>
      </section>
      {/* Stats Dashboard */}
      <section className="px-4 py-2">
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary flex items-center justify-center mb-2">
              <Truck />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              To Ship
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              3
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
              <Package />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              To Receive
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              1
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
              <Wallet />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Wallet
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              $840
            </span>
          </div>
        </div>
      </section>
      {/* List Sections */}
      <div className="flex-1 flex flex-col gap-6 px-4 py-6">
        {/* Buying & Selling */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Transactions
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                  <ShoppingBag />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">
                  My Orders
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <Store />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">
                  My Sales
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            <button onClick={() => router.push('/saved-items')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400">
                  <Heart />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">
                  Saved Items
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </section>
        {/* Selling Tools */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
            My Listings
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
            <button onClick={() => router.push('/my-listings')} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <Rainbow />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-slate-900 dark:text-white font-medium">
                    Active Listings
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  5
                </span> */}
                <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  <NotebookPen />
                </div>
                <span className="text-slate-900 dark:text-white font-medium">
                  Drafts
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </section>
        {/* Account Settings */}
        <section>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 ml-1">
            Account
          </h3>
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700/50">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <CreditCard className="material-symbols-outlined text-slate-400 text-[22px]" />
                <span className="text-slate-900 dark:text-white font-medium">
                  Payment Methods
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <LucideLocationEdit className="material-symbols-outlined text-slate-400 text-[22px]" />
                <span className="text-slate-900 dark:text-white font-medium">
                  Shipping Addresses
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <Bell className="material-symbols-outlined text-slate-400 text-[22px]" />
                <span className="text-slate-900 dark:text-white font-medium">
                  Notifications
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
              <div className="flex items-center gap-3">
                <HelpCircle className="material-symbols-outlined text-slate-400 text-[22px]" />
                <span className="text-slate-900 dark:text-white font-medium">
                  Help &amp; Support
                </span>
              </div>
              <ChevronRight className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </section>
        {/* Logout */}
        <button onClick={handleLogout} className="w-full text-center mt-4 mb-24 py-3 text-red-500 font-semibold bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Log Out
        </button>
      </div>
    </div>
  );
}
