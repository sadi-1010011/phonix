"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function EditListingScreen() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Form State
    const [brand, setBrand] = useState("Apple");
    const [model, setModel] = useState("iPhone 14 Pro");
    const [condition, setCondition] = useState("Good");
    const [storageOption, setStorageOption] = useState("128 GB");
    const [color, setColor] = useState("Midnight");
    const [price, setPrice] = useState("650");
    const [description, setDescription] = useState("");
    const [newImages, setNewImages] = useState<File[]>([]); // Newly added files
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // URLs already on server

    useEffect(() => {
        if (id && user) {
            const fetchListing = async () => {
                try {
                    const docRef = doc(db, "listings", id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();

                        // Check ownership
                        if (data.sellerId !== user.uid) {
                            alert("You do not have permission to edit this listing.");
                            router.push("/my-listings");
                            return;
                        }

                        setBrand(data.brand);
                        setModel(data.model);
                        setCondition(data.condition);
                        setStorageOption(data.storage);
                        setColor(data.color);
                        setPrice(data.price.toString());
                        setDescription(data.description);
                        setExistingImageUrls(data.imageUrls || []);
                    } else {
                        alert("Listing not found.");
                        router.push("/my-listings");
                    }
                } catch (error) {
                    console.error("Error fetching listing:", error);
                } finally {
                    setFetching(false);
                }
            };
            fetchListing();
        }
    }, [id, user, router]);


    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const totalImages = existingImageUrls.length + newImages.length + newFiles.length;

            if (totalImages > 5) {
                alert("You can only have up to 5 photos in total.");
                return;
            }
            setNewImages((prev) => [...prev, ...newFiles]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setExistingImageUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!user || !id) return;
        setLoading(true);

        try {
            // 1. Upload New Images
            const newUploadedUrls = [];
            for (const file of newImages) {
                const url = await uploadToCloudinary(file);
                newUploadedUrls.push(url);
            }

            const finalImageUrls = [...existingImageUrls, ...newUploadedUrls];

            // 2. Update Document
            await updateDoc(doc(db, "listings", id), {
                brand,
                model,
                condition,
                storage: storageOption,
                color,
                price: parseFloat(price),
                description,
                imageUrls: finalImageUrls,
                updatedAt: serverTimestamp(),
            });

            // 3. Navigate back
            router.push("/my-listings");

        } catch (error) {
            console.error("Error updating listing: ", error);
            alert("Failed to update listing. Please try again.");
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

    // Creating previews for new images
    const newImagePreviews = newImages.map(file => URL.createObjectURL(file));

    return (
        <ProtectedRoute>
            <div className="relative flex h-full max-w-md mx-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-hidden group/design-root">
                {/* Header */}
                <header className="sticky top-0 z-50 flex items-center bg-background-light dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 justify-between border-b border-slate-200 dark:border-slate-800">
                    <button onClick={() => router.back()} className="text-slate-900 dark:text-white flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                        Edit Listing
                    </h2>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto pb-24">
                    {/* Photo Upload Section */}
                    <section className="mt-4">
                        <div className="px-4 pb-2 pt-2 flex justify-between items-end">
                            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                                Photos
                            </h3>
                            <span className="text-slate-500 dark:text-slate-400 text-xs">
                                {existingImageUrls.length + newImages.length}/5
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 px-4">
                            {/* Existing Images */}
                            {existingImageUrls.map((url, index) => (
                                <div key={`existing-${index}`} className="aspect-[3/4] relative rounded-xl overflow-hidden group shadow-sm bg-gray-100 dark:bg-gray-800">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                            COVER
                                        </div>
                                    )}
                                    <button onClick={() => removeExistingImage(index)} className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </div>
                            ))}

                            {/* New Images */}
                            {newImagePreviews.map((url, index) => (
                                <div key={`new-${index}`} className="aspect-[3/4] relative rounded-xl overflow-hidden group shadow-sm bg-gray-100 dark:bg-gray-800">
                                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                    <button onClick={() => removeNewImage(index)} className="absolute top-2 right-2 bg-black/60 p-1 rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                    <div className="absolute bottom-2 right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                        NEW
                                    </div>
                                </div>
                            ))}

                            {/* Add Button */}
                            {(existingImageUrls.length + newImages.length) < 5 && (
                                <button className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-primary/40 hover:border-primary flex flex-col items-center justify-center text-primary bg-primary/5 hover:bg-primary/10 transition-colors gap-2">
                                    <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                                    <span className="text-xs font-semibold">Add Photo</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                        multiple
                                    />
                                </button>
                            )}
                        </div>
                    </section>
                    <div className="h-2 bg-transparent" />
                    {/* Device Details Section */}
                    <section className="px-4 py-4 space-y-6">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                            Device Details
                        </h3>
                        {/* Brand & Model Selectors */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Brand */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Brand
                                </label>
                                <div className="relative">
                                    <select
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-4 pr-10 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-base"
                                    >
                                        <option value="Apple">Apple</option>
                                        <option value="Samsung">Samsung</option>
                                        <option value="Google">Google</option>
                                    </select>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </span>
                                </div>
                            </div>
                            {/* Model */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Model
                                </label>
                                <div className="relative">
                                    <select
                                        value={model}
                                        onChange={(e) => setModel(e.target.value)}
                                        className="w-full appearance-none rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-4 pr-10 text-slate-900 dark:text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-base"
                                    >
                                        <option value="iPhone 14 Pro">iPhone 14 Pro</option>
                                        <option value="iPhone 14">iPhone 14</option>
                                        <option value="iPhone 13">iPhone 13</option>
                                        <option value="Galaxy S23 Ultra">Galaxy S23 Ultra</option>
                                        <option value="Pixel 7 Pro">Pixel 7 Pro</option>
                                    </select>
                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Condition */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Condition
                            </label>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                {["Like New", "Good", "Fair", "Broken"].map((opt) => (
                                    <label key={opt} className="cursor-pointer shrink-0">
                                        <input
                                            className="peer sr-only"
                                            name="condition"
                                            type="radio"
                                            value={opt}
                                            checked={condition === opt}
                                            onChange={(e) => setCondition(e.target.value)}
                                        />
                                        <span className="flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white">
                                            {opt}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        {/* Specs (Storage & Color) */}
                        <div className="grid grid-cols-1 gap-6 pt-2">
                            {/* Storage */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Storage
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["128 GB", "256 GB", "512 GB"].map(opt => (
                                        <label key={opt} className="cursor-pointer">
                                            <input
                                                className="peer sr-only"
                                                name="storage"
                                                type="radio"
                                                value={opt}
                                                checked={storageOption === opt}
                                                onChange={(e) => setStorageOption(e.target.value)}
                                            />
                                            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 text-center transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary">
                                                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                    {opt}
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Color */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Color
                                </label>
                                <div className="flex gap-4">
                                    {[
                                        { name: "Midnight", hex: "#353843" },
                                        { name: "Starlight", hex: "#fbf7f4" },
                                        { name: "Silver", hex: "#a1a1a5" }
                                    ].map((col) => (
                                        <label key={col.name} className="cursor-pointer group relative">
                                            <input
                                                className="peer sr-only"
                                                name="color"
                                                type="radio"
                                                value={col.name}
                                                checked={color === col.name}
                                                onChange={(e) => setColor(e.target.value)}
                                            />
                                            <span
                                                className="block size-10 rounded-full border border-slate-200 ring-2 ring-offset-2 ring-offset-background-light dark:ring-offset-background-dark ring-transparent peer-checked:ring-primary transition-all"
                                                style={{ backgroundColor: col.hex }}
                                            />
                                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-medium whitespace-nowrap">
                                                {col.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="h-2 bg-transparent" />
                    {/* Price & Description */}
                    <section className="px-4 py-4 space-y-6">
                        <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">
                            Price &amp; Description
                        </h3>
                        {/* Price Input */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Set your price
                            </label>
                            <div className="relative rounded-xl shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                    <span className="text-slate-500 text-lg font-semibold">$</span>
                                </div>
                                <input
                                    className="block w-full rounded-xl border-slate-300 dark:border-slate-700 pl-8 py-4 pr-12 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary text-xl font-bold bg-white dark:bg-slate-800"
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                    <span className="text-slate-400 text-sm">USD</span>
                                </div>
                            </div>
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <textarea
                                    className="block w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary text-base py-3 px-4 resize-none"
                                    placeholder="Describe any scratches, battery health, or included accessories..."
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                                    {description.length}/300
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sticky Footer Action */}
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
                                <span className="material-symbols-outlined text-sm">check</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </ProtectedRoute >
    );
}
