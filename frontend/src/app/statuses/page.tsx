"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJSON, del, postJSON } from "@/lib/api";
import type { BrandStatus } from "@/types";

export default function StatusesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newStatus, setNewStatus] = useState({
    code: "",
    label: ""
  });

  // Consulta de estados
  const { data: statusesData, isLoading: statusesLoading, isError: statusesError, refetch } = useQuery<BrandStatus[]>({
    queryKey: ["statuses"],
    queryFn: () => getJSON<BrandStatus[]>("statuses")
  });

  async function handleDelete(id: number, label: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar el estado "${label}"?`)) {
      try {
        await del(`statuses/${id}`);
        refetch();
      } catch (error) {
        alert('Error al eliminar el estado');
      }
    }
  }

  async function handleCreateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!newStatus.code.trim() || !newStatus.label.trim()) {
      alert('El código y la etiqueta son obligatorios');
      return;
    }

    try {
      const payload = {
        code: newStatus.code.trim().toUpperCase(),
        label: newStatus.label.trim()
      };
      
      await postJSON("statuses", payload);
      setNewStatus({ code: "", label: "" });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      alert('Error al crear el estado. Verifica que el código no esté duplicado.');
    }
  }

  const getStatusBadgeClass = (code: string) => {
    switch (code) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Estados de Marca
              </h1>
              <p className="text-gray-600 subtitle">
                Administra los estados disponibles para las marcas registradas
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Estado
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Estado</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateStatus} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={newStatus.code}
                    onChange={(e) => setNewStatus({ ...newStatus, code: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="ej: SUSPENDED"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Se convertirá automáticamente a mayúsculas</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Etiqueta *
                  </label>
                  <input
                    type="text"
                    value={newStatus.label}
                    onChange={(e) => setNewStatus({ ...newStatus, label: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                    placeholder="ej: Suspendida"
                    required
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
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Crear Estado
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
          {statusesLoading && (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-3 text-amber-600">
                <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="font-medium">Cargando estados...</span>
              </div>
            </div>
          )}

          {statusesError && (
            <div className="p-12 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="font-medium">Error al cargar los estados</p>
              </div>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
              >
                Reintentar
              </button>
            </div>
          )}

          {statusesData && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {statusesData.map((status) => (
                <div 
                  key={status.id} 
                  className="group bg-white/80 rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(status.code)}`}>
                          {status.code}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(status.id, status.label)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">{status.label}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p><span className="font-medium">ID:</span> {status.id}</p>
                      <p><span className="font-medium">Código:</span> {status.code}</p>
                      <p><span className="font-medium">Creado:</span> {new Date(status.created_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {statusesData.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <div className="text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">No hay estados configurados</p>
                    <p className="text-gray-400">Crea el primer estado para comenzar</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
