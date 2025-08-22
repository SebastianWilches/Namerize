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

  // Páginas internas - con sidebar usando todo el viewport
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '320px 1fr',
      height: '100vh',
      width: '100vw',
      gap: '0',
      overflow: 'hidden',
      position: 'fixed',
      top: '0',
      left: '0'
    }}>
      <Sidebar />
      <main style={{ 
        minWidth: '0', 
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {children}
      </main>
    </div>
  );
}
