"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export default function AuthPage() {
  const router = useRouter();
  // State for toggling between Log In (true) and Sign Up (false)
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [error, setError] = useState("");

  // Handle Email/Password Auth
  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // --- LOG IN FLOW ---
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/explore");
      } else {
        // --- SIGN UP FLOW ---
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: "User", // Default name, can be updated later
          createdAt: serverTimestamp(),
          photoURL: "",
          locality: "Unknown Location",
        });

        router.push("/explore");
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      // Firebase defines error codes, we can map them to friendly messages if needed
      setError(err.message || "Authentication failed");
    }
  };

  // Handle Google Auth
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user document exists; if not, create it
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          name: user.displayName || "User",
          createdAt: serverTimestamp(),
          photoURL: user.photoURL || "",
          locality: "Unknown Location",
        });
      }

      router.push("/explore");
    } catch (err: any) {
      console.error("Google auth error:", err);
      setError(err.message || "Google authentication failed");
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-white dark:bg-[#151c2b] shadow-2xl min-[450px]:my-8 min-[450px]:rounded-2xl min-[450px]:min-h-[800px] border dark:border-gray-800">
      {/* Header Image Section */}
      <div className="@container">
        <div className="p-4 pb-0">
          <div
            className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[220px] shadow-sm relative"
            data-alt="Modern smartphone resting on a minimalist desk surface with soft lighting"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZh6WbPvdPLVgYZ4KJ0sh3QvmSPqNbgkN8PLPEPsNVO7ZxSmr0gCp16-95-UB6o_Em7fktL2hcUennlQSM69fDrbp5jeHsEZ5pGjmUhgXIsmOwymD1HqJSaKZNbpVmG2il4tMi7dP8UgLYaK4LVcuB3eAB0cczfqXR0IaRT5Z9nmEkCguKeTgWlWHRbY2EtMV6vllt3TKDcw6G0j83JImgA8HRrI-e3HgV4amsr38iNzURg6PaUgji_2237ny8EiCyp9yMqEN1yO4")',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="relative z-10 p-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md mb-2">
                <span className="material-symbols-outlined text-white">
                  smartphone
                </span>
              </div>
              <p className="text-white text-sm font-medium opacity-90">
                Secure Marketplace
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="px-6 pt-5 pb-2">
        <h2 className="text-[#0d121b] dark:text-white tracking-tight text-[28px] font-bold leading-tight text-center">
          Trade phones securely
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mt-2 font-medium">
          Join the community to buy &amp; sell instantly.
        </p>
      </div>

      {/* Segmented Control (Toggle) */}
      <div className="px-6 py-4">
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-[#f0f2f5] dark:bg-[#1e2532] p-1 border border-gray-100 dark:border-gray-700">
          <label className="group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-[#2c3545] has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-blue-400 text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all duration-200">
            <span className="truncate">Log In</span>
            <input
              className="invisible w-0 h-0 absolute"
              name="auth-toggle"
              type="radio"
              checked={isLogin}
              onChange={() => setIsLogin(true)}
            />
          </label>
          <label className="group flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 has-[:checked]:bg-white dark:has-[:checked]:bg-[#2c3545] has-[:checked]:shadow-sm has-[:checked]:text-primary dark:has-[:checked]:text-blue-400 text-slate-500 dark:text-slate-400 text-sm font-semibold transition-all duration-200">
            <span className="truncate">Sign Up</span>
            <input
              className="invisible w-0 h-0 absolute"
              name="auth-toggle"
              type="radio"
              checked={!isLogin}
              onChange={() => setIsLogin(false)}
            />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleAuth} className="flex flex-col gap-4 px-6 pb-2">
        {/* Email Field */}
        <label className="flex flex-col w-full">
          <span className="text-[#0d121b] dark:text-slate-200 text-sm font-semibold leading-normal pb-2 ml-1">
            Email Address
          </span>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500 text-[20px]">
              mail
            </span>
            <input
              className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2532] focus:border-primary h-12 placeholder:text-slate-400 pl-11 pr-4 text-base font-normal transition-shadow"
              placeholder="name@example.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </label>

        {/* Password Field */}
        <label className="flex flex-col w-full">
          <span className="text-[#0d121b] dark:text-slate-200 text-sm font-semibold leading-normal pb-2 ml-1">
            Password
          </span>
          <div className="relative flex w-full items-center">
            <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500 text-[20px]">
              lock
            </span>
            <input
              className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2532] focus:border-primary h-12 placeholder:text-slate-400 pl-11 pr-12 text-base font-normal transition-shadow"
              placeholder="Enter your password"
              type={!visibility ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
          className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
          type="button"
        >
            { visibility ? <span onClick={() => setVisibility(false)} className="material-symbols-outlined text-[20px]">visibility_off</span> : <span onClick={() => setVisibility(true)} className="material-symbols-outlined text-[20px]">visibility</span> }
        </button>
          </div>
        </label>

        {/* Confirm Password Field (Signup Only) */}
        {!isLogin && (
          <label className="flex flex-col w-full">
            <span className="text-[#0d121b] dark:text-slate-200 text-sm font-semibold leading-normal pb-2 ml-1">
              Confirm Password
            </span>
            <div className="relative flex w-full items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 dark:text-slate-500 text-[20px]">
                lock_reset
              </span>
              <input
                className="form-input flex w-full resize-none overflow-hidden rounded-xl text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2532] focus:border-primary h-12 placeholder:text-slate-400 pl-11 pr-12 text-base font-normal transition-shadow"
                placeholder="Confirm your password"
                type={!visibility ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
          className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]" onClick={() => setVisibility(!visibility)}>
            {visibility ? 'visibility_off' : 'visibility'}
          </span>
        </button>
            </div>
          </label>
        )}

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        {/* Forgot Password Link (Login Only) */}
        {isLogin && (
          <div className="flex justify-end pt-1">
            <Link
              className="text-primary hover:text-blue-700 dark:hover:text-blue-400 text-sm font-semibold transition-colors"
              href="#"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="py-2">
          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 active:bg-blue-800 text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/30 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{isLogin ? "Log In" : "Create Account"}</span>
            <span className="material-symbols-outlined text-[18px] font-bold">
              arrow_forward
            </span>
          </button>
        </div>
      </form>

      {/* Social Login Divider */}
      <div className="flex items-center gap-4 px-6 py-2">
        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
        <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider">
          Or continue with
        </p>
        <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1" />
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-3 px-6 py-4">
        {/* Apple (Visual only for now) */}
        <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2532] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-[#0d121b] dark:text-white font-medium shadow-sm">
          <svg
            fill="currentColor"
            height={20}
            viewBox="0 0 24 24"
            width={20}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M16.3636 12.7273C16.3636 10.9705 17.8182 9.77273 17.8977 9.72727C16.9432 8.36364 15.4659 8.13636 14.9318 8.11364C13.6364 7.97727 12.375 8.875 11.7159 8.875C11.0455 8.875 9.98864 8.125 8.92045 8.14773C7.53409 8.17045 6.26136 8.95455 5.54545 10.1932C4.10227 12.6932 5.17045 16.4318 6.57955 18.4659C7.27273 19.4659 8.09091 20.5795 9.17045 20.5455C10.2273 20.5 10.6364 19.8636 11.9091 19.8636C13.1705 19.8636 13.5455 20.5455 14.6591 20.5227C15.8182 20.5 16.5568 19.4545 17.2273 18.4659C17.7273 17.7386 17.9318 17.375 18.1591 16.8636C18.1136 16.8409 16.3636 16.1591 16.3636 12.7273ZM13.0682 6.32955C13.6477 5.625 14.0341 4.64773 13.9318 3.68182C13.0455 3.71591 11.9773 4.27273 11.3409 5.02273C10.7841 5.65909 10.2955 6.64773 10.4318 7.60227C11.4091 7.68182 12.4886 7.03409 13.0682 6.32955Z" />
          </svg>
          <span>Apple</span>
        </button>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e2532] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-[#0d121b] dark:text-white font-medium shadow-sm"
        >
          <svg
            fill="none"
            height={20}
            viewBox="0 0 24 24"
            width={20}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.52 12.2727C23.52 11.4239 23.4448 10.6051 23.3034 9.81818H12V14.4602H18.4568C18.1784 15.9602 17.333 17.233 16.0614 18.0841V21.0966H19.9386C22.2068 19.008 23.52 15.9341 23.52 12.2727Z"
              fill="#4285F4"
            />
            <path
              d="M12 24C15.24 24 17.958 22.9261 19.942 21.0966L16.065 18.0841C14.9905 18.8045 13.6159 19.2273 12 19.2273C8.87386 19.2273 6.22955 17.1159 5.28636 14.2818H1.27727V17.3909C3.25091 21.3102 7.31182 24 12 24Z"
              fill="#34A853"
            />
            <path
              d="M5.28636 14.2818C5.04682 13.5659 4.91364 12.7977 4.91364 12C4.91364 11.2023 5.04682 10.4341 5.28636 9.71818V6.60909H1.27727C0.463636 8.22955 0 10.0636 0 12C0 13.9364 0.463636 15.7705 1.27727 17.3909L5.28636 14.2818Z"
              fill="#FBBC05"
            />
            <path
              d="M12 4.77273C13.7636 4.77273 15.3409 5.37955 16.5852 6.56818L20.0261 3.12727C17.9545 1.19318 15.2364 0 12 0C7.31182 0 3.25091 2.68977 1.27727 6.60909L5.28636 9.71818C6.22955 6.88409 8.87386 4.77273 12 4.77273Z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </button>
      </div>

      {/* Footer / Skip */}
      <div className="mt-auto px-6 py-6 pb-8 text-center">
        <Link
          className="text-slate-500 hover:text-primary dark:text-slate-400 text-sm font-medium transition-colors"
          href="/explore"
        >
          Skip for now
        </Link>
      </div>
    </div>
  );
}
