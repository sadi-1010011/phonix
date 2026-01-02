"use client";

import {
  Home,
  MessageCircleMore,
  Plus,
  Search,
  User2,
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 z-50 max-w-md mx-auto">
      <div className="flex justify-around items-center h-16 px-2">
        <a
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${ pathname === '/explore' ? 'text-primary' : 'hover:text-slate-600 dark:hover:text-slate-300 group' }`}
          href="/explore"
        >
          <Home className={`text-[24px] ${ pathname === '/' ? 'fill-current' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
          <span className="text-[10px] font-medium">Home</span>
        </a>
        <a
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${ pathname === '/search' ? 'text-primary' : 'hover:text-slate-600 dark:hover:text-slate-300 group' }`}
          href="/search"
        >
          <Search className={`text-[24px] ${ pathname === '/search' ? 'fill-current' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
          <span className="text-[10px] font-medium">Search</span>
        </a>

        <div className="relative -top-5">
          <a
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg shadow-blue-500/40 text-white hover:bg-blue-600 transition-colors"
            href="/add"
          >
            <Plus className="text-[28px]" />
          </a>
        </div>

        <a
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${ pathname === '/chat' ? 'text-primary' : 'hover:text-slate-600 dark:hover:text-slate-300 group' }`}
          href="/inbox"
        >
          <MessageCircleMore className={`text-[24px] ${ pathname === '/chat' ? 'fill-current' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
          <span className="text-[10px] font-medium">Inbox</span>
        </a>
        <a
          className={`flex flex-col items-center justify-center w-full h-full gap-1 ${ pathname === '/profile' ? 'text-primary' : 'hover:text-slate-600 dark:hover:text-slate-300 group' }`}
          href="/profile"
        >
          <User2 className={`text-[24px] ${ pathname === '/profile' ? 'fill-current' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
          <span className="text-[10px] font-medium">Profile</span>
        </a>
      </div>
    </nav>
  );
}
