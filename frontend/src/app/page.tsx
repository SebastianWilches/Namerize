"use client";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => getJSON<{ status: string }>("health"),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Namerize</h1>
            </div>
            <div className="flex items-center space-x-2">
              {isLoading && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <span className="text-sm">Conectando...</span>
                </div>
              )}
              {isError && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                  <span className="text-sm">Sin conexión</span>
                </div>
              )}
              {data && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm">Conectado</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
                Gestiona tus{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-teal-600 bg-clip-text text-transparent">
                  marcas registradas
                </span>{" "}
                con facilidad
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed subtitle">
                Namerize es la plataforma completa para registrar, organizar y administrar
                marcas comerciales. Mantén el control total de tu portafolio de marcas
                con nuestra interfaz intuitiva y potentes herramientas de gestión.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/brands"
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
              >
                <span>Comenzar ahora</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/holders"
                className="px-8 py-4 bg-white/70 backdrop-blur-sm text-gray-700 font-semibold rounded-xl border border-gray-300 hover:bg-white/90 hover:border-gray-400 transition-all duration-200"
              >
                Ver titulares
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Gestión de Marcas</h3>
              <p className="text-gray-600 subtitle">
                Registra, actualiza y organiza tus marcas comerciales con información
                detallada sobre su estado y titular.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Control de Titulares</h3>
              <p className="text-gray-600 subtitle">
                Administra la información de personas y empresas titulares
                de las marcas registradas.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Estados y Seguimiento</h3>
              <p className="text-gray-600 subtitle">
                Mantén un seguimiento preciso del estado de cada marca:
                pendiente, activa o inactiva.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
