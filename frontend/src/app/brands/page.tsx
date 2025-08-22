"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getJSON, del, postJSON } from "@/lib/api";
import type { Brand, Paginated, Holder, BrandStatus } from "@/types";
import Link from "next/link";
import styles from "./brands.module.css";

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    description: "",
    holder_id: "",
    status_id: ""
  });
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


  // Consulta de titulares para dropdown
  const { data: holdersData, isLoading: holdersLoading, isError: holdersError } = useQuery<Paginated<Holder>>({
    queryKey: ["holders-dropdown"],
    queryFn: () => getJSON<Paginated<Holder>>("holders", { include_inactive: true, page: 1, page_size: 100 })
  });

  // Consulta de estados para dropdown
  const { data: statusesData, isLoading: statusesLoading, isError: statusesError } = useQuery<BrandStatus[]>({
    queryKey: ["statuses-dropdown"],
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

    // Validación del formulario
  const isFormValid = () => {
    return newBrand.name.trim() !== "" && 
           newBrand.holder_id !== "" && 
           newBrand.status_id !== "";
  };

  async function handleCreateBrand(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Nombre, titular y estado son obligatorios');
      return;
    }

    try {
      const payload = {
        name: newBrand.name.trim(),
        description: newBrand.description.trim() || null,
        holder_id: parseInt(newBrand.holder_id),
        status_id: parseInt(newBrand.status_id)
      };
      
      await postJSON("brands", payload);
      setNewBrand({ name: "", description: "", holder_id: "", status_id: "" });
      setShowCreateForm(false);
      refetch();
    } catch (error) {
      alert('Error al crear la marca');
    }
  }

  const totalPages = brandsData ? Math.max(1, Math.ceil(brandsData.total / brandsData.page_size)) : 1;

  return (
    <div className={styles.brandsContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <section className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1>Gestión de Marcas</h1>
              <p>Administra tu portafolio de marcas comerciales registradas</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={styles.newBrandButton}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Marca
            </button>
          </div>
        </section>

        {/* Create Form */}
        {showCreateForm && (
          <section className={styles.createFormSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Crear Nueva Marca</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className={styles.closeButton}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateBrand}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Nombre de la Marca *</label>
                  <input
                    type="text"
                    value={newBrand.name}
                    onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                    className={styles.formInput}
                    placeholder="ej: Coca Cola"
                    required
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Titular *</label>
                  <select
                    value={newBrand.holder_id}
                    onChange={(e) => setNewBrand({ ...newBrand, holder_id: e.target.value })}
                    className={styles.formSelect}
                    required
                    disabled={holdersLoading}
                  >
                    <option value="">
                      {holdersLoading ? 'Cargando titulares...' : 
                       holdersError ? 'Error al cargar titulares' :
                       !holdersData?.items?.length ? 'No hay titulares disponibles' :
                       'Selecciona un titular'}
                    </option>
                    {holdersData?.items?.map((holder) => (
                      <option key={holder.id} value={holder.id}>
                        {holder.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Estado *</label>
                  <select
                    value={newBrand.status_id}
                    onChange={(e) => setNewBrand({ ...newBrand, status_id: e.target.value })}
                    className={styles.formSelect}
                    required
                    disabled={statusesLoading}
                  >
                    <option value="">
                      {statusesLoading ? 'Cargando estados...' : 
                       statusesError ? 'Error al cargar estados' :
                       !statusesData?.length ? 'No hay estados disponibles' :
                       'Selecciona un estado'}
                    </option>
                    {statusesData?.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.label} ({status.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formField} style={{ gridColumn: '1 / -1' }}>
                  <label className={styles.formLabel}>Descripción</label>
                  <textarea
                    value={newBrand.description}
                    onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                    className={styles.formTextarea}
                    placeholder="Descripción opcional de la marca"
                    rows={4}
                  />
                </div>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={!isFormValid()}
                  style={{
                    opacity: isFormValid() ? 1 : 0.5,
                    cursor: isFormValid() ? 'pointer' : 'not-allowed'
                  }}
                >
                  Crear Marca
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Search */}
        <section className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className={styles.searchInput}
              />
            </div>
            <button
              onClick={() => setPage(1)}
              className={styles.searchButton}
            >
              Buscar
        </button>
      </div>
        </section>

        {/* Content */}
        <section className={styles.contentSection}>
          {brandsLoading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <span className={styles.loadingText}>Cargando marcas...</span>
            </div>
          )}

          {brandsError && (
            <div className={styles.errorState}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p>Error al cargar las marcas</p>
              <button onClick={() => refetch()} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          )}

          {brandsData && (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th>#</th>
                      <th>Marca</th>
                      <th>Titular</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
                  <tbody className={styles.tableBody}>
                    {brandsData.items.map((brand, index) => {
                      const statusInfo = getStatusInfo(brand.status_id);
                      return (
                        <tr key={brand.id}>
                          <td>{(page - 1) * pageSize + index + 1}</td>
                          <td>
                            <div className={styles.brandInfo}>
                              <span className={styles.brandName}>{brand.name}</span>
                              {brand.description && (
                                <span className={styles.brandDescription}>{brand.description}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className={styles.holderName}>
                              {getHolderName(brand.holder_id)}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles[statusInfo.code.toLowerCase()]}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            <span className={styles.dateText}>
                              {new Date(brand.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </td>
                          <td>
                            <div className={styles.actionsContainer}>
                              <Link
                                href={`/brands/${brand.id}`}
                                className={`${styles.actionButton} ${styles.viewButton}`}
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Ver
                              </Link>
                              <button
                                onClick={() => handleDelete(brand.id, brand.name)}
                                className={`${styles.actionButton} ${styles.deleteButton}`}
                              >
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <td colSpan={6}>
                          <div className={styles.emptyState}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H7m2 0v-5a2 2 0 012-2h2a2 2 0 012 2v5" />
                            </svg>
                            <p className={styles.emptyStateTitle}>No se encontraron marcas</p>
                            <p className={styles.emptyStateText}>Intenta ajustar tu búsqueda o crear una nueva marca</p>
                          </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
              </div>

              {/* Pagination */}
              {brandsData.total > pageSize && (
                <div className={styles.pagination}>
                  <div className={styles.paginationInfo}>
                    Mostrando {Math.min((page - 1) * pageSize + 1, brandsData.total)} - {Math.min(page * pageSize, brandsData.total)} de {brandsData.total} marcas
                  </div>
                  <div className={styles.paginationControls}>
            <button
              disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                      className={styles.paginationButton}
            >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
              Anterior
            </button>
                    <span className={styles.pageInfo}>
                      Página {page} de {totalPages}
            </span>
            <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className={styles.paginationButton}
            >
              Siguiente
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
            </button>
          </div>
                </div>
              )}
        </>
          )}
    </section>
      </div>
    </div>
  );
}
