"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, RotateCw, ClipboardCheck, Star, BarChart3 } from "lucide-react";

const navItems = [
  { href: "/", label: "单元", icon: BookOpen },
  { href: "/learn", label: "学习", icon: Home },
  { href: "/review", label: "复习", icon: RotateCw },
  { href: "/test", label: "测试", icon: ClipboardCheck },
  { href: "/favorites", label: "收藏", icon: Star },
  { href: "/stats", label: "统计", icon: BarChart3 },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-blue-100">
      <div className="container mx-auto px-4">
        {/* Logo Bar */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-clay-sm">
              <span className="text-white font-bold text-xl font-display">V</span>
            </div>
            <span className="text-2xl font-bold font-display text-primary">VocabMaster</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="clay-card px-4 py-2 flex items-center gap-2">
              <span className="text-sm font-medium">🔥 15天</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-orange to-orange-400 flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </div>

        {/* Nav Tabs */}
        <div className="flex gap-2 pb-2 overflow-x-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-clay-sm"
                    : "text-gray-600 hover:bg-white hover:shadow-clay-sm"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
