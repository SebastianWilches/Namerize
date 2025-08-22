"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJSON, del, postJSON } from "@/lib/api";
import type { BrandStatus } from "@/types";
import styles from "./statuses.module.css";

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
      } catch {
        alert('Error al eliminar el estado');
      }
    }
  }

  // Validación del formulario
  const isFormValid = () => {
    return newStatus.code.trim() !== "" && 
           newStatus.label.trim() !== "";
  };

  async function handleCreateStatus(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isFormValid()) {
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
    } catch {
      alert('Error al crear el estado. Verifica que el código no esté duplicado.');
    }
  }

  const getStatusBadgeClass = (code: string) => {
    switch (code) {
      case 'ACTIVE': return styles.active;
      case 'PENDING': return styles.pending;
      case 'INACTIVE': return styles.inactive;
      default: return styles.default;
    }
  };

  return (
    <div className={styles.statusesContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <section className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1>Estados de Marca</h1>
              <p>Administra los estados disponibles para las marcas registradas</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={styles.newStatusButton}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Estado
            </button>
          </div>
        </section>

        {/* Create Form */}
        {showCreateForm && (
          <section className={styles.createFormSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Crear Nuevo Estado</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className={styles.closeButton}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateStatus}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Código *</label>
                  <input
                    type="text"
                    value={newStatus.code}
                    onChange={(e) => setNewStatus({ ...newStatus, code: e.target.value })}
                    className={styles.formInput}
                    placeholder="ej: SUSPENDED"
                    required
                  />
                  <p className={styles.formHint}>Se convertirá automáticamente a mayúsculas</p>
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Etiqueta *</label>
                  <input
                    type="text"
                    value={newStatus.label}
                    onChange={(e) => setNewStatus({ ...newStatus, label: e.target.value })}
                    className={styles.formInput}
                    placeholder="ej: Suspendida"
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
                  Crear Estado
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Content */}
        <section className={styles.contentSection}>
          {statusesLoading && (
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <span className={styles.loadingText}>Cargando estados...</span>
            </div>
          )}

          {statusesError && (
            <div className={styles.errorState}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p>Error al cargar los estados</p>
              <button onClick={() => refetch()} className={styles.retryButton}>
                Reintentar
              </button>
            </div>
          )}

          {statusesData && (
            <>
              {statusesData.length > 0 ? (
                <div className={styles.cardGrid}>
                  {statusesData.map((status) => (
                    <div key={status.id} className={styles.statusCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.cardIconAndBadge}>
                          <div className={styles.cardIcon}>
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className={`${styles.statusBadge} ${getStatusBadgeClass(status.code)}`}>
                            {status.code}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(status.id, status.label)}
                          className={styles.deleteButton}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className={styles.cardContent}>
                        <h3 className={styles.statusTitle}>{status.label}</h3>
                        <div className={styles.statusDetails}>
                          <div className={styles.statusDetail}>
                            <strong>ID:</strong> 
                            <span>{status.id}</span>
                          </div>
                          <div className={styles.statusDetail}>
                            <strong>Código:</strong> 
                            <span>{status.code}</span>
                          </div>
                          <div className={styles.statusDetail}>
                            <strong>Creado:</strong> 
                            <span>{new Date(status.created_at).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className={styles.emptyStateTitle}>No hay estados configurados</p>
                  <p className={styles.emptyStateText}>Crea el primer estado para comenzar</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}