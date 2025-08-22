"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";
import styles from "./page.module.css";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => getJSON<{ status: string }>("health"),
  });

  return (
    <div className={styles.landingContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              N
            </div>
            <h1 className={styles.logoText}>Namerize</h1>
          </div>
          
          <div className={`${styles.statusIndicator} ${
            isLoading ? styles.loading : 
            isError ? styles.error : 
            styles.connected
          }`}>
            <div className={`${styles.statusDot} ${data ? styles.pulse : ''}`}
                 style={{
                   backgroundColor: isLoading ? '#f59e0b' : 
                                   isError ? '#dc2626' : '#16a34a'
                 }}
            />
            <span>
              {isLoading ? 'Conectando...' : 
               isError ? 'Sin conexión' : 'Conectado'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h2 className={styles.heroTitle}>
              <span className={styles.heroTitleLine}>Gestiona tus</span>
              <span className={`${styles.heroTitleLine} ${styles.heroTitleGradient}`}>
                marcas registradas
              </span>
              <span className={styles.heroTitleLine}>con facilidad</span>
            </h2>
            
            <p className={styles.heroSubtitle}>
              Namerize es la plataforma completa para registrar, organizar y administrar
              marcas comerciales. Mantén el control total de tu portafolio de marcas
              con nuestra interfaz intuitiva y potentes herramientas de gestión.
            </p>
            
            <div className={styles.heroButtons}>
              <Link href="/brands" className={styles.primaryButton}>
                <span>Comenzar ahora</span>
                <svg className={styles.buttonIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              
              <Link href="/holders" className={styles.secondaryButton}>
                <span>Ver titulares</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <div className={styles.featuresGrid}>
              <div className={`${styles.featureCard} animate-fade-in-up`}>
                <div className={styles.featureIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Gestión de Marcas</h3>
                <p className={styles.featureDescription}>
                  Registra, actualiza y organiza tus marcas comerciales con información
                  detallada sobre su estado y titular. Sistema completo de seguimiento
                  y administración.
                </p>
              </div>

              <div className={`${styles.featureCard} animate-fade-in-up`}>
                <div className={styles.featureIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Control de Titulares</h3>
                <p className={styles.featureDescription}>
                  Administra la información de personas y empresas titulares
                  de las marcas registradas. Gestión completa de contactos y
                  documentación legal.
                </p>
              </div>

              <div className={`${styles.featureCard} animate-fade-in-up`}>
                <div className={styles.featureIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className={styles.featureTitle}>Estados y Seguimiento</h3>
                <p className={styles.featureDescription}>
                  Mantén un seguimiento preciso del estado de cada marca:
                  pendiente, activa o inactiva. Control total del ciclo de vida
                  de tus registros marcarios.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}