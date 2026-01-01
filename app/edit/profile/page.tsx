"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditProfileScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [name, setName] = useState("");
    const [locality, setLocality] = useState("");
    const [bio, setBio] = useState("");
    const [currentPhotoURL, setCurrentPhotoURL] = useState("");
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState("");

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setName(data.name || "");
                        setLocality(data.locality || "");
                        setBio(data.bio || "");
                        setCurrentPhotoURL(data.photoURL || "");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setFetching(false);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!user) return;
        setLoading(true);

        try {
            let photoURL = currentPhotoURL;

            // 1. Upload New Image if selected
            if (newPhoto) {
                photoURL = await uploadToCloudinary(newPhoto);
            }

            // 2. Update User Document
            await setDoc(doc(db, "users", user.uid), {
                name,
                locality,
                bio,
                photoURL,
            }, { merge: true });

            // 3. Navigate back
            router.push("/profile");

        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="relative flex h-full max-w-md mx-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden group/design-root">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 justify-between border-b border-slate-200 dark:border-slate-800">
                    <button onClick={() => router.back()} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                        Edit Profile
                    </h2>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto pb-24 px-4 py-6">
                    {/* Access Profile Image */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg bg-gray-200">
                                {(previewUrl || currentPhotoURL) ? (
                                    <img
                                        src={previewUrl || currentPhotoURL}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <span className="material-symbols-outlined text-4xl">person</span>
                                    </div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md">
                                <span className="material-symbols-outlined text-sm">edit</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            Tap to change photo
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary py-3 px-4"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Locality */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Locality / City
                            </label>
                            <input
                                type="text"
                                className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary py-3 px-4"
                                value={locality}
                                onChange={(e) => setLocality(e.target.value)}
                                placeholder="e.g. New York, USA"
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-primary focus:ring-primary py-3 px-4 resize-none"
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us a bit about yourself..."
                            />
                        </div>
                    </div>

                </div>

                {/* Sticky Footer */}
                <div className="absolute bottom-0 left-0 right-0 background-light dark:bg-background-dark/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 p-4 z-40 safe-area-bottom">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ProtectedRoute>
    );
}
