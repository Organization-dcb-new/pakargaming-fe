"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../hooks/useAuth";
import { Gift, LogOut } from "lucide-react";

const menus = [{ name: "Referral", href: "/en/referral", icon: Gift }];

export default function ReferralClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/50 dark:via-purple-900/50 to-background flex justify-center">
      <div className="w-full max-w-6xl flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 py-10 px-4 flex flex-col h-[calc(100vh-2.5rem)] sticky top-0">
          {/* Menu label */}
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-4 mb-3">
            Menu
          </p>

          {/* Nav links */}
          <div className="flex flex-col space-y-1 mb-3">
            {menus.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${
                      isActive
                        ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                        : "text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {name}
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 cursor-pointer text-start w-full px-4 py-2 mt-2 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-10 px-6">
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl shadow-sm p-8 min-h-[80vh]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
