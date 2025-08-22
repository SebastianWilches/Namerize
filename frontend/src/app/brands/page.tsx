"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getJSON, del } from "@/lib/api";
import type { Brand, Paginated, Holder, BrandStatus } from "@/types";
import Link from "next/link";

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Consulta de marcas
  const { data: brandsData, isLoading: brandsLoading, isError: brandsError, refetch } = useQuery<Paginated<Brand>>({
    queryKey: ["brands", { search, page, pageSize }],
    queryFn: () => {
      const params: Record<string, any> = { page, page_size: pageSize };
      const trimmed = search.trim();
      if (trimmed !== "") {
        params.search = trimmed;
      }
      return getJSON<Paginated<Brand>>("brands", params);
    },
    placeholderData: keepPreviousData,
  });

  // Consulta de titulares para mostrar nombres
  const { data: holdersData } = useQuery<Paginated<Holder>>({
    queryKey: ["holders"],
    queryFn: () => getJSON<Paginated<Holder>>("holders", { page: 1, page_size: 1000 })
  });

  // Consulta de estados para mostrar etiquetas
  const { data: statusesData } = useQuery<BrandStatus[]>({
    queryKey: ["statuses"],
    queryFn: () => getJSON<BrandStatus[]>("statuses")
  });

  // Helper functions
  const getHolderName = (holderId: number) => {
    return holdersData?.items.find(h => h.id === holderId)?.name || `Titular ${holderId}`;
  };

  const getStatusInfo = (statusId: number) => {
    const status = statusesData?.find(s => s.id === statusId);
    return status || { code: 'UNKNOWN', label: 'Desconocido' };
  };

  const getStatusBadgeClass = (code: string) => {
    switch (code) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  async function handleDelete(id: number, name: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar la marca "${name}"?`)) {
      try {
        await del(`brands/${id}`);
        refetch();
      } catch (error) {
        alert('Error al eliminar la marca');
      }
    }
  }

  const totalPages = brandsData ? Math.max(1, Math.ceil(brandsData.total / brandsData.page_size)) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-teal-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Marcas
              </h1>
              <p className="text-gray-600 subtitle">
                Administra tu portafolio de marcas comerciales registradas
              </p>
            </div>
            <Link
              href="/brands/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Marca
            </Link>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={() => setPage(1)}
              className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
          {brandsLoading && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 text-indigo-600">
                <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Cargando marcas...</span>
              </div>
            </div>
          )}

          {brandsError && (
            <div className="p-12 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="font-medium">Error al cargar las marcas</p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          )}

          {brandsData && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">#</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Marca</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Titular</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Fecha</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {brandsData.items.map((brand, index) => {
                      const statusInfo = getStatusInfo(brand.status_id);
                      return (
                        <tr key={brand.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {(page - 1) * pageSize + index + 1}
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-semibold text-gray-900">{brand.name}</p>
                              {brand.description && (
                                <p className="text-sm text-gray-600 mt-1">{brand.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-gray-900">{getHolderName(brand.holder_id)}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(statusInfo.code)}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            {new Date(brand.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/brands/${brand.id}`}
                                className="inline-flex items-center gap-1 px-3 py-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver
                              </Link>
                              <button
                                onClick={() => handleDelete(brand.id, brand.name)}
                                className="inline-flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {brandsData.items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No se encontraron marcas</p>
                            <p className="text-gray-400">Intenta ajustar tu búsqueda o crear una nueva marca</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {brandsData.total > pageSize && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Mostrando {Math.min((page - 1) * pageSize + 1, brandsData.total)} - {Math.min(page * pageSize, brandsData.total)} de {brandsData.total} marcas
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={page <= 1}
                        onClick={() => setPage(p => p - 1)}
                        className="inline-flex items-center gap-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                      </button>
                      <span className="px-3 py-2 text-sm text-gray-700">
                        Página {page} de {totalPages}
                      </span>
                      <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(p => p + 1)}
                        className="inline-flex items-center gap-1 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        Siguiente
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
