"use client";

export default function NotificationsPage() {
    
    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-xl">
            {/* TopAppBar */}
            <div className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center p-4 justify-between">
                    <h2 className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] flex-1">
                        Notifications
                    </h2>
                    <button className="flex items-center justify-end focus:outline-none focus:ring-2 ring-primary/50 rounded">
                        <p className="text-primary text-sm font-semibold leading-normal tracking-[0.015em] hover:text-blue-600 transition-colors">
                            Mark all read
                        </p>
                    </button>
                </div>
                {/* Chips / Filter Segment */}
                <div className="flex gap-3 px-4 pb-3 overflow-x-auto no-scrollbar mask-gradient-right">
                    <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary pl-4 pr-4 transition-transform active:scale-95">
                        <p className="text-white text-sm font-medium leading-normal">All</p>
                    </button>
                    <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1e2736] border border-gray-200 dark:border-gray-700 pl-4 pr-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                            Buying
                        </p>
                    </button>
                    <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1e2736] border border-gray-200 dark:border-gray-700 pl-4 pr-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                            Selling
                        </p>
                    </button>
                    <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-white dark:bg-[#1e2736] border border-gray-200 dark:border-gray-700 pl-4 pr-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors active:scale-95">
                        <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-normal">
                            System
                        </p>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto pb-8">
                {/* Section: Today */}
                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-4 pt-6 pb-2">
                    Today
                </h3>
                {/* Item 1: System (Unread) */}
                <div className="relative group">
                    <div className="flex gap-4 px-4 py-4 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-start">
                            <div className="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 shrink-0 size-10">
                                <span className="material-symbols-outlined text-[20px]">lock</span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight truncate pr-2">
                                    Security Update
                                </p>
                                <span className="text-slate-400 text-xs shrink-0 whitespace-nowrap">
                                    10m ago
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-snug line-clamp-2">
                                Your password was successfully updated via web browser.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center self-center pl-1">
                            <div className="size-2.5 rounded-full bg-primary" />
                        </div>
                    </div>
                </div>
                {/* Item 2: Offer (Unread) */}
                <div className="relative group">
                    <div className="flex gap-4 px-4 py-4 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-start">
                            <div className="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary shrink-0 size-10">
                                <span className="material-symbols-outlined text-[20px]">
                                    local_offer
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight truncate pr-2">
                                    New Offer: $450
                                </p>
                                <span className="text-slate-400 text-xs shrink-0 whitespace-nowrap">
                                    2h ago
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-snug line-clamp-2">
                                Buyer123 made an offer for your{" "}
                                <span className="font-medium text-slate-800 dark:text-slate-200">
                                    iPhone 13 Pro
                                </span>
                                . Tap to view details.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center justify-center pl-1">
                            <div
                                className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700 bg-cover bg-center border border-gray-300 dark:border-gray-600 relative"
                                data-alt="Close up of a dark colored smartphone"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBeQUltsuT_Z7DjvtzlHhLZGdqwcEsKUAY9fTVbPog0R_5Ajx0sH3XB1EBm_jv3dpza7dE8GZrTtrQIsNEdmnPU3km38IALyCkUxoE1fHIueTQzhrvw9_rAkVQgWe4SamYYIJh0Pfq3c9pisFMVkgz0V4yesQwzmdOyR9yotD63DFuwmHBkb5jHcTTx2pTY0PLByvwr2E3iFMV_metGINcpkAydvZ7b2svU_c2rR1_SPpnE55JCvriSS9-Dz5ovNbpZW2sdl0iFPUs")'
                                }}
                            >
                                <div className="absolute -top-1 -right-1 size-3 rounded-full bg-primary border-2 border-white dark:border-[#101622]" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Item 3: Message (Unread) */}
                <div className="relative group">
                    <div className="flex gap-4 px-4 py-4 bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-start">
                            <div
                                className="size-10 rounded-full bg-gray-300 bg-cover bg-center"
                                data-alt="Portrait of a young man named Alex"
                                style={{
                                    backgroundImage:
                                        'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCZTWNgdb716DJu5XyiGdV7JX1Yg18cNqffUmsKrKi0Lsmnsw-hcdD02a2t_oc5leV4jBM34UFPDzbIOtgbjTlFPr_pta9n7XezvNbEQxhxw98fz9qMGzm4MZTjDpYZFhqlI6ge6aUD_qLgow6GqdiWXAu86KNqyusfFDdltpX_x3MzBuUG54L_FD1EbCqwjRoWtUSAUmFsHzD9CbfalqT1WPQ9Go5--ETcUAeU70Vs8JpoebSqfNoQoRiaCBqvEd7ssT6gCpTLUNQ")'
                                }}
                            />
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <p className="text-slate-900 dark:text-white text-sm font-bold leading-tight truncate pr-2">
                                    Message from Alex
                                </p>
                                <span className="text-slate-400 text-xs shrink-0 whitespace-nowrap">
                                    3h ago
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-sm font-normal leading-snug line-clamp-2">
                                Is the Samsung S21 still available? I can pick it up today.
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center self-center pl-1">
                            <span className="material-symbols-outlined text-primary text-[24px]">
                                chat_bubble
                            </span>
                        </div>
                    </div>
                </div>
                {/* Section: Yesterday */}
                <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider px-4 pt-6 pb-2">
                    Yesterday
                </h3>
                {/* Item 4: Price Drop (Read) */}
                <div className="relative group">
                    <div className="flex gap-4 px-4 py-4 bg-white dark:bg-[#1e2736] hover:bg-gray-50 dark:hover:bg-[#253041] transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-start">
                            <div className="flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 shrink-0 size-10">
                                <span className="material-symbols-outlined text-[20px]">
                                    trending_down
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight truncate pr-2">
                                    Price Drop Alert
                                </p>
                                <span className="text-slate-400 text-xs shrink-0 whitespace-nowrap">
                                    1d ago
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-snug line-clamp-2">
                                The{" "}
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    Google Pixel 7
                                </span>{" "}
                                you were watching has dropped to $399.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Item 5: System Update (Read) */}
                <div className="relative group">
                    <div className="flex gap-4 px-4 py-4 bg-white dark:bg-[#1e2736] hover:bg-gray-50 dark:hover:bg-[#253041] transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-start">
                            <div className="flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 shrink-0 size-10">
                                <span className="material-symbols-outlined text-[20px]">
                                    rocket_launch
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight truncate pr-2">
                                    Version 2.0 is live!
                                </p>
                                <span className="text-slate-400 text-xs shrink-0 whitespace-nowrap">
                                    1d ago
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-snug line-clamp-2">
                                We've added dark mode and improved search speed. Check out the new
                                features now.
                            </p>
                        </div>
                    </div>
                </div>
                {/* Item 6: Saved Search (Read) */}
                <div className="relative group">
                    <div className="flex gap-4 px-4 py-4 bg-white dark:bg-[#1e2736] hover:bg-gray-50 dark:hover:bg-[#253041] transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-start">
                            <div className="flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shrink-0 size-10">
                                <span className="material-symbols-outlined text-[20px]">
                                    bookmark
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col justify-center min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight truncate pr-2">
                                    New matching item
                                </p>
                                <span className="text-slate-400 text-xs shrink-0 whitespace-nowrap">
                                    2d ago
                                </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-snug line-clamp-2">
                                3 new items match your search for{" "}
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    "iPad Mini 6"
                                </span>
                                .
                            </p>
                        </div>
                    </div>
                </div>
                {/* End of list spacer */}
                <div className="h-8" />
                <div className="flex flex-col items-center justify-center py-8 opacity-50">
                    <div className="h-1 w-1 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
                    <div className="h-1 w-1 bg-slate-300 dark:bg-slate-600 rounded-full mb-1" />
                    <div className="h-1 w-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
                    <p className="mt-4 text-xs text-slate-400 text-center font-medium">
                        No more notifications
                    </p>
                </div>
            </div>
        </div>

    );
}