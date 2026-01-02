"use client";
import { ArrowRight, ArrowRightCircle, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const slides = [
    {
      id: 1,
      headline: (
        <>
          Trade Smart, <br />
          <span className="text-primary">Upgrade Fast</span>
        </>
      ),
      description:
        "The safest marketplace to buy premium pre-owned phones or sell your old device for cash instantly.",
      image:
        'url("/images/onboarding2.jpg")',
      badge: {
        icon: ShieldCheck,
        title: "Secure Transactions",
        subtitle: "Verified sellers & buyers",
        colorClass: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      },
    },
    {
      id: 2,
      headline: (
        <>
          Instant Cash, <br />
          <span className="text-primary">Zero Hassle</span>
        </>
      ),
      description:
        "Get an instant valuation for your device and get paid as soon as our agent picks it up.",
      image:
        'url("/images/onboarding1.jpg")',
      badge: {
        icon: Zap,
        title: "Instant Valuation",
        subtitle: "Best market rates guaranteed",
        colorClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
    },
    {
      id: 3,
      headline: (
        <>
          Premium Quality, <br />
          <span className="text-primary">Certified</span>
        </>
      ),
      description:
        "Every device passes a strict 52-point quality check to ensure you get exactly what you ordered.",
      image:
        'url("/images/onboarding3.jpg")',
      badge: {
        icon: Sparkles,
        title: "Quality Assured",
        subtitle: "52-point check certified",
        colorClass: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      },
    },
  ];

  // Auto-slide logic
  useEffect(() => {
    // If it's the last slide, do not auto-advance
    if (currentSlide === slides.length - 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev: number) => (prev < slides.length - 1 ? prev + 1 : prev));
    }, 4000); // 4 seconds interval

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  // Touch handlers for swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      setCurrentSlide((prev: number) => prev + 1);
    }
    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide((prev: number) => prev - 1);
    }
  };

  const activeSlide = slides[currentSlide];
  const BadgeIcon = activeSlide.badge.icon;

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden bg-background-light dark:bg-background-dark shadow-2xl ring-1 ring-black/5">
      {/* Header / Status Area */}
      <div onClick={() => router.push("/login")} className="absolute -top-12 z-10 flex w-full cursor-pointer justify-end p-6 pt-12">
        <button className="group flex hover:opacity-80 transition-opacity items-center gap-1 rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-gray-600 backdrop-blur-md transition-colors hover:bg-white/80 dark:bg-black/20 dark:text-gray-300 dark:hover:bg-black/40">
          Skip <ArrowRight size="12" />
        </button>
      </div>

      {/* Hero Illustration Section */}
      <div className="relative flex flex-1 flex-col items-center justify-center p-8 transition-all duration-500 ease-in-out">
        {/* Background Decoration */}
        <div className="absolute left-1/2 top-1/2 h-75 w-75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[60px] dark:bg-primary/5" />

        {/* Hero Image */}
        <div className="relative z-0 h-full w-full max-h-105 overflow-hidden rounded-4xl shadow-xl shadow-primary/10 ring-4 ring-white dark:ring-gray-800">
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-700 hover:scale-105"
            data-alt="Feature Illustration"
            style={{
              backgroundImage: activeSlide.image,
              backgroundPosition: "center",
            }}
          >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />

            {/* Floating Badge (Dynamic) */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur-sm dark:bg-gray-900/95 transition-all duration-300 transform translate-y-0 opacity-100">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${activeSlide.badge.colorClass}`}>
                <BadgeIcon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {activeSlide.badge.title}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activeSlide.badge.subtitle}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sheet - Swipable Area */}
      <div
        className="relative z-10 flex flex-col items-center rounded-t-[2.5rem] bg-white px-6 pb-10 pt-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:bg-[#151c2c] transition-transform duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Page Indicators */}
        <div className="mb-6 flex w-full flex-row items-center justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
                ? "w-6 bg-primary"
                : "w-1.5 bg-[#cfd7e7] dark:bg-gray-700"
                }`}
            />
          ))}
        </div>

        {/* Headlines */}
        <div className="mb-8 w-full text-center h-[140px] flex flex-col items-center justify-start">
          <h1 className="mb-3 px-4 text-[32px] font-extrabold leading-[1.15] tracking-tight text-[#0d121b] dark:text-white transition-opacity duration-300">
            {activeSlide.headline}
          </h1>
          <p className="px-4 text-[15px] leading-relaxed text-gray-500 dark:text-gray-400 transition-opacity duration-300">
            {activeSlide.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-3.5">
          {/* Primary Button */}
          <button onClick={() => router.push("/explore")} className="group relative flex h-14 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-[16px] font-bold tracking-[0.015em] text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] active:shadow-none hover:shadow-primary/40">
            <span className="relative z-10 flex items-center gap-2">
              Start Exploring
              <ArrowRightCircle size={16} />
            </span>
            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>

          {/* Secondary Button */}
          <button onClick={() => router.push("/login")} className="flex h-14 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-transparent px-5 text-[16px] font-semibold tracking-[0.015em] text-[#0d121b] transition-colors hover:bg-gray-50 active:scale-[0.98] dark:border-gray-700 dark:text-white dark:hover:bg-white/5">
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
