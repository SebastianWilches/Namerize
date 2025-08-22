"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getJSON, del, postJSON } from "@/lib/api";
import type { Holder, Paginated } from "@/types";

export default function HoldersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHolder, setNewHolder] = useState({
    name: "",
    legal_identifier: "",
    email: ""
  });
  const pageSize = 10;

  const { data: holdersData, isLoading: holdersLoading, isError: holdersError, refetch } = useQuery<Paginated<Holder>>({
    queryKey: ["holders", { search, page, pageSize }],
    queryFn: () => {
      const params: Record<string, any> = { page, page_size: pageSize };
      const trimmed = search.trim();
      if (trimmed !== "") {
        params.search = trimmed;
      }
      return getJSON<Paginated<Holder>>("holders", params);
    },
    placeholderData: keepPreviousData,
  });

  async function handleDelete(id: number, name: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar el titular "${name}"?`)) {
      try {
        await del(`holders/${id}`);
        refetch();
      } catch (error) {
        alert('Error al eliminar el titular');
      }
    }
  }

  async function handleCreateHolder(e: React.FormEvent) {
    e.preventDefault();
    if (!newHolder.name.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    try {
      const payload = {
        name: newHolder.name.trim(),
        legal_identifier: newHolder.legal_identifier.trim() || null,
        email: newHolder.email.trim() || null
      };
      
      await postJSON("holders", payload);
      setNewHolder({ name: "", legal_identifier: "", email: "" });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      alert('Error al crear el titular');
    }
  }

  const totalPages = holdersData ? Math.max(1, Math.ceil(holdersData.total / holdersData.page_size)) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestión de Titulares
              </h1>
              <p className="text-gray-600 subtitle">
                Administra personas y empresas titulares de marcas registradas
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Titular
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Titular</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateHolder} className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={newHolder.name}
                    onChange={(e) => setNewHolder({ ...newHolder, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    placeholder="Nombre completo o razón social"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Identificación Legal
                  </label>
                  <input
                    type="text"
                    value={newHolder.legal_identifier}
                    onChange={(e) => setNewHolder({ ...newHolder, legal_identifier: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    placeholder="NIT, RUC, RFC, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newHolder.email}
                    onChange={(e) => setNewHolder({ ...newHolder, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Crear Titular
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
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
                placeholder="Buscar por nombre, identificación o email..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
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
          {holdersLoading && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 text-teal-600">
                <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Cargando titulares...</span>
              </div>
            </div>
          )}

          {holdersError && (
            <div className="p-12 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="font-medium">Error al cargar los titulares</p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          )}

          {holdersData && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">#</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Nombre</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Identificación</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Fecha</th>
                      <th className="text-right py-4 px-6 font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {holdersData.items.map((holder, index) => (
                      <tr key={holder.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {(page - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center">
                              <span className="text-teal-700 font-semibold text-sm">
                                {holder.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{holder.name}</p>
                              <p className="text-xs text-gray-500">ID: {holder.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-gray-900">
                            {holder.legal_identifier || (
                              <span className="text-gray-400 italic">No especificado</span>
                            )}
                          </p>
                        </td>
                        <td className="py-4 px-6">
                          {holder.email ? (
                            <a 
                              href={`mailto:${holder.email}`}
                              className="text-teal-600 hover:text-teal-800 hover:underline transition-colors duration-200"
                            >
                              {holder.email}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">No especificado</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(holder.created_at).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleDelete(holder.id, holder.name)}
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
                    ))}
                    {holdersData.items.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-12 text-center">
                          <div className="text-gray-500">
                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No se encontraron titulares</p>
                            <p className="text-gray-400">Intenta ajustar tu búsqueda o crear un nuevo titular</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {holdersData.total > pageSize && (
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Mostrando {Math.min((page - 1) * pageSize + 1, holdersData.total)} - {Math.min(page * pageSize, holdersData.total)} de {holdersData.total} titulares
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
