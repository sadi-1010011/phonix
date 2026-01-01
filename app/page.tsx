"use client";
import { ArrowRight, ArrowRightCircle, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  
  const router = useRouter();
  
  return (
    <div className="relative mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl ring-1 ring-black/5">
      {/* Header / Status Area */}
      <div className="absolute top-0 z-10 flex w-full justify-end p-6 pt-12">
        <button className="group flex items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-gray-600 backdrop-blur-md transition-colors hover:bg-white/80 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-black/40">
          Skip <ArrowRight size="12" />
        </button>
      </div>
      {/* Hero Illustration Section */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-8">
        {/* Background Decoration */}
        <div className="absolute left-1/2 top-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[60px] dark:bg-primary/5" />
        {/* Hero Image */}
        <div className="relative z-0 h-full w-full max-h-105 overflow-hidden rounded-4xl shadow-xl shadow-primary/10 ring-4 ring-white dark:ring-gray-800">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
            data-alt="A sleek modern smartphone displayed with a clean minimalist background"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDjIjrpv3EZcT_yOzk8Mcims5yzhcdvY3823zvkrEQRbWr-HsBCemdOQcfc4A3q-DOp_yCE3CBJh6zzdRaffcizAPI9StNuVUaN7y8Aj7cQ59i2a9xRBKqilWGTHtrv9HoMFHPdT3my03kbZM2d-iEw7dUQAef8m-L2PanLPVcaUufMftjCzslvP2mdkEKa4G1H4-AgIdcDBd6koy8qvtolOM9tHWUCSWCcv2F6kfv_bSTlSUfKaACtNYr743imgk64yzYgeNJIE7E")',
            }}
          >
            {/* Overlay Gradient for text readability if needed, though mostly decorative here */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            {/* Floating Badge (Simulating the Secure Transactions feature) */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-gray-900/95">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <ShieldCheck size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  Secure Transactions
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400">
                  Verified sellers &amp; buyers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content Sheet */}
      <div className="relative z-10 flex flex-col items-center rounded-t-[2.5rem] bg-white px-6 pb-10 pt-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:bg-[#151c2c]">
        {/* Page Indicators */}
        <div className="mb-6 flex w-full flex-row items-center justify-center gap-2">
          <div className="h-1.5 w-6 rounded-full bg-primary transition-all duration-300" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#cfd7e7] dark:bg-gray-700" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#cfd7e7] dark:bg-gray-700" />
        </div>
        {/* Headlines */}
        <div className="mb-8 w-full text-center">
          <h1 className="mb-3 px-4 text-[32px] font-extrabold leading-[1.15] tracking-tight text-[#0d121b] dark:text-white">
            Trade Smart, <br />
            <span className="text-primary">Upgrade Fast</span>
          </h1>
          <p className="px-4 text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
            The safest marketplace to buy premium pre-owned phones or sell your
            old device for cash instantly.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3.5">
          {/* Primary Button */}
          <button className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-[16px] font-bold tracking-[0.015em] text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] active:shadow-none hover:shadow-primary/40">
            <span className="relative z-10 flex items-center gap-2">
              Start Exploring
              <ArrowRightCircle size={16} />
            </span>
            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
          {/* Secondary Button */}
          <button onClick={()=> router.push("/login") } className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-transparent px-5 text-[16px] font-semibold tracking-[0.015em] text-[#0d121b] transition-colors hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:text-white dark:hover:bg-white/5">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
