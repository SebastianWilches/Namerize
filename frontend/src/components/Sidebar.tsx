"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Marcas",
      href: "/brands",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
        </svg>
      ),
      gradient: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      activeBg: "bg-gradient-to-r from-indigo-500 to-purple-600"
    },
    {
      name: "Titulares", 
      href: "/holders",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700",
      activeBg: "bg-gradient-to-r from-teal-500 to-cyan-600"
    },
    {
      name: "Estados",
      href: "/statuses", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50",
      textColor: "text-amber-700",
      activeBg: "bg-gradient-to-r from-amber-500 to-orange-600"
    }
  ];

  return (
    <aside className="lg:sticky lg:top-6 h-max">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Namerize</h1>
              <p className="text-xs text-gray-500">Brand Registry</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          <ul className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200
                      ${isActive 
                        ? `${item.activeBg} text-white shadow-md` 
                        : `hover:${item.bgColor} ${item.textColor} hover:shadow-sm hover:scale-[1.02]`
                      }
                    `}
                  >
                    <div className={`
                      flex items-center justify-center h-6 w-6 transition-transform duration-200
                      ${isActive ? "scale-110" : "group-hover:scale-110"}
                    `}>
                      {item.icon}
                    </div>
                    <span className="font-semibold">{item.name}</span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-gray-200/50">
          <div className="text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              Sistema activo
            </p>
            <p>© 2024 Namerize</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
