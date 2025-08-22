"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getJSON, del, postJSON } from "@/lib/api";
import type { Holder, Paginated } from "@/types";
import styles from "./holders.module.css";

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

  // Helper para formatear fechas de manera segura
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Fecha no disponible";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Fecha inválida";
      }
      
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Fecha inválida";
    }
  };

  // Consulta de titulares
  const { data: holdersData, isLoading: holdersLoading, isError: holdersError, refetch } = useQuery<Paginated<Holder>>({
    queryKey: ["holders", { search, page, pageSize }],
    queryFn: () => {
      const params: Record<string, string | number | boolean> = { page, page_size: pageSize };
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
      } catch {
        alert('Error al eliminar el titular');
      }
    }
  }

  // Validación del formulario
  const isFormValid = () => {
    return newHolder.name.trim() !== "" && 
           newHolder.legal_identifier.trim() !== "" && 
           newHolder.email.trim() !== "";
  };

  async function handleCreateHolder(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Todos los campos son obligatorios');
      return;
    }

    try {
      const payload = {
        name: newHolder.name.trim(),
        legal_identifier: newHolder.legal_identifier.trim(),
        email: newHolder.email.trim()
      };
      
      await postJSON("holders", payload);
      setNewHolder({ name: "", legal_identifier: "", email: "" });
      setShowCreateForm(false);
      refetch();
    } catch {
      alert('Error al crear el titular');
    }
  }

  const totalPages = holdersData ? Math.max(1, Math.ceil(holdersData.total / holdersData.page_size)) : 1;

  return (
    <div className={styles.holdersContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <section className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1>Gestión de Titulares</h1>
              <p>Administra personas y empresas titulares de marcas registradas</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={styles.newHolderButton}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Titular
            </button>
          </div>
        </section>

        {/* Create Form */}
        {showCreateForm && (
          <section className={styles.createFormSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Crear Nuevo Titular</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className={styles.closeButton}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateHolder}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Nombre *</label>
                  <input
                    type="text"
                    value={newHolder.name}
                    onChange={(e) => setNewHolder({ ...newHolder, name: e.target.value })}
                    className={styles.formInput}
                    placeholder="Nombre completo o razón social"
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Identificación Legal *</label>
                  <input
                    type="text"
                    value={newHolder.legal_identifier}
                    onChange={(e) => setNewHolder({ ...newHolder, legal_identifier: e.target.value })}
                    className={styles.formInput}
                    placeholder="NIT, RUC, RFC, etc."
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Email *</label>
                  <input
                    type="email"
                    value={newHolder.email}
                    onChange={(e) => setNewHolder({ ...newHolder, email: e.target.value })}
                    className={styles.formInput}
                    placeholder="correo@ejemplo.com"
                    required
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
                  Crear Titular
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
                placeholder="Buscar por nombre, identificación o email..."
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
          {holdersLoading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <span className={styles.loadingText}>Cargando titulares...</span>
            </div>
          )}

          {holdersError && (
            <div className={styles.errorState}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p>Error al cargar los titulares</p>
              <button onClick={() => refetch()} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          )}

          {holdersData && (
            <>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Identificación</th>
                      <th>Email</th>
                      <th>Fecha</th>
                      <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody className={styles.tableBody}>
                    {holdersData.items.map((holder, index) => (
                      <tr key={holder.id}>
                        <td>{(page - 1) * pageSize + index + 1}</td>
                        <td>
                          <div className={styles.holderProfile}>
                            <div className={styles.avatar}>
                              {holder.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.holderInfo}>
                              <span className={styles.holderName}>{holder.name}</span>
                              <span className={styles.holderId}>ID: {holder.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={holder.legal_identifier ? styles.legalIdentifier : styles.notSpecified}>
                            {holder.legal_identifier || "No especificado"}
                          </span>
                        </td>
                        <td>
                          {holder.email ? (
                            <a 
                              href={`mailto:${holder.email}`}
                              className={styles.emailLink}
                            >
                              {holder.email}
                            </a>
                          ) : (
                            <span className={styles.notSpecified}>No especificado</span>
                          )}
                        </td>
                        <td>
                          <span className={styles.dateText}>
                            {formatDate(holder.created_at)}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actionsContainer}>
                            <button
                              onClick={() => handleDelete(holder.id, holder.name)}
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
                    ))}
                    {holdersData.items.length === 0 && (
                      <tr>
                        <td colSpan={6}>
                          <div className={styles.emptyState}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <p className={styles.emptyStateTitle}>No se encontraron titulares</p>
                            <p className={styles.emptyStateText}>Intenta ajustar tu búsqueda o crear un nuevo titular</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {holdersData.total > pageSize && (
                <div className={styles.pagination}>
                  <div className={styles.paginationInfo}>
                    Mostrando {Math.min((page - 1) * pageSize + 1, holdersData.total)} - {Math.min(page * pageSize, holdersData.total)} de {holdersData.total} titulares
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