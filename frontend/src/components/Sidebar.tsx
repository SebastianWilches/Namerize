"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Marcas",
      href: "/brands",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
        </svg>
      ),
      className: "brands"
    },
    {
      name: "Titulares", 
      href: "/holders",
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      className: "holders"
    },
    {
      name: "Estados",
      href: "/statuses", 
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      className: "statuses"
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContainer}>
        {/* Header */}
        <div className={styles.header}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              N
            </div>
            <div className={styles.logoInfo}>
              <h1>Namerize</h1>
              <p>Brand Registry</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <ul className={styles.navigationList}>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name} className={styles.navigationItem}>
                  <Link
                    href={item.href}
                    className={`${styles.navigationLink} ${styles[item.className]} ${isActive ? styles.active : ''}`}
                  >
                    <div className={styles.navigationIcon}>
                      {item.icon}
                    </div>
                    <span className={styles.navigationText}>{item.name}</span>
                    {isActive && (
                      <div className={styles.activeIndicator} />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer info */}
        <div className={styles.footer}>
          <div className={styles.footerContent}>
            <p>
              <div className={styles.statusIndicator}></div>
              Sistema activo
            </p>
            <p>© 2024 Namerize</p>
          </div>
        </div>
      </div>
    </aside>
  );
}