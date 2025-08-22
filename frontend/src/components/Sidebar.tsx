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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <div className={styles.statusIndicator}></div>
              <span>Sistema activo</span>
            </div>
            <p>Elaborado por: Sebastian Wilches</p>
          </div>
        </div>
      </div>
    </aside>
  );
}