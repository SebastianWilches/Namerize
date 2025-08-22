"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  if (isHomePage) {
    // Landing page - sin sidebar
    return <>{children}</>;
  }

  // Páginas internas - con sidebar
  return (
    <div className="mx-auto max-w-7xl p-6 grid gap-6 lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="min-w-0">{children}</main>
    </div>
  );
}
