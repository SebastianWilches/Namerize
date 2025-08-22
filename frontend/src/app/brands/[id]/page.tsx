"use client";
import { useState, useEffect, use } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJSON, putJSON } from "@/lib/api";
import type { Brand, Holder, BrandStatus, Paginated } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

interface Params {
  params: Promise<{ id: string }>;
}

export default function BrandDetailPage({ params }: Params) {
  const router = useRouter();
  const resolvedParams = use(params);
  const brandId = parseInt(resolvedParams.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    holder_id: "",
    status_id: ""
  });

  // Consulta de la marca
  const { data: brand, isLoading: brandLoading, isError: brandError, refetch } = useQuery<Brand>({
    queryKey: ["brand", brandId],
    queryFn: () => getJSON<Brand>(`brands/${brandId}`)
  });

  // Consulta de titulares para dropdown
  const { data: holdersData } = useQuery<Paginated<Holder>>({
    queryKey: ["holders-dropdown"],
    queryFn: () => getJSON<Paginated<Holder>>("holders", { include_inactive: true, page: 1, page_size: 100 })
  });

  // Consulta de estados para dropdown
  const { data: statusesData } = useQuery<BrandStatus[]>({
    queryKey: ["statuses-dropdown"],
    queryFn: () => getJSON<BrandStatus[]>("statuses")
  });

  // Inicializar formulario cuando se carga la marca
  useEffect(() => {
    if (brand) {
      setEditForm({
        name: brand.name,
        description: brand.description || "",
        holder_id: brand.holder_id.toString(),
        status_id: brand.status_id.toString()
      });
    }
  }, [brand]);

  // Validación del formulario
  const isFormValid = () => {
    return editForm.name.trim() !== "" && 
           editForm.holder_id !== "" && 
           editForm.status_id !== "";
  };

  // Helper functions
  const getHolderName = (holderId: number) => {
    return holdersData?.items.find(h => h.id === holderId)?.name || `Titular ${holderId}`;
  };

  const getStatusInfo = (statusId: number) => {
    const status = statusesData?.find(s => s.id === statusId);
    return status || { id: statusId, code: "UNKNOWN", label: `Estado ${statusId}` };
  };

  const getStatusBadgeClass = (code: string) => {
    switch (code) {
      case 'ACTIVE': return styles.active;
      case 'PENDING': return styles.pending;
      case 'INACTIVE': return styles.inactive;
      default: return styles.active;
    }
  };

  async function handleUpdateBrand(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isFormValid()) {
      alert('Nombre, titular y estado son obligatorios');
      return;
    }

    try {
      const payload = {
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
        holder_id: parseInt(editForm.holder_id),
        status_id: parseInt(editForm.status_id)
      };
      
      await putJSON(`brands/${brandId}`, payload);
      setIsEditing(false);
      refetch();
      alert('Marca actualizada exitosamente');
    } catch (error) {
      alert('Error al actualizar la marca');
    }
  }

  if (brandLoading) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.contentWrapper}>
          <section className={styles.detailSection}>
            <div className={styles.loadingState}>
              <div className={styles.loadingSpinner}></div>
              <span className={styles.loadingText}>Cargando marca...</span>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (brandError || !brand) {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.contentWrapper}>
          <section className={styles.detailSection}>
            <div className={styles.errorState}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p>No se pudo cargar la marca con ID {brandId}</p>
              <Link href="/brands" className={styles.backButton}>
                Volver a marcas
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(brand.status_id);

  return (
    <div className={styles.detailContainer}>
      <div className={styles.contentWrapper}>
        {/* Header */}
        <section className={styles.headerSection}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1>Detalles de Marca</h1>
              <p>Información completa y edición de la marca registrada</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/brands" className={styles.backButton}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver
              </Link>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={styles.editButton}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Edit Form */}
        {isEditing && (
          <section className={styles.editFormSection}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Editar Marca</h2>
              <button
                onClick={() => setIsEditing(false)}
                className={styles.closeButton}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdateBrand}>
              <div className={styles.formGrid}>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>ID (No editable)</label>
                  <input
                    type="text"
                    value={brand.id}
                    className={`${styles.formInput} ${styles.disabledField}`}
                    disabled
                    readOnly
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Nombre de la Marca *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={styles.formInput}
                    placeholder="ej: Coca Cola"
                    required
                  />
                </div>
                
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Titular *</label>
                  <select
                    value={editForm.holder_id}
                    onChange={(e) => setEditForm({ ...editForm, holder_id: e.target.value })}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Selecciona un titular</option>
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
                    value={editForm.status_id}
                    onChange={(e) => setEditForm({ ...editForm, status_id: e.target.value })}
                    className={styles.formSelect}
                    required
                  >
                    <option value="">Selecciona un estado</option>
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
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className={styles.formTextarea}
                    placeholder="Descripción opcional de la marca"
                    rows={4}
                  />
                </div>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
                  Actualizar Marca
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Detail View */}
        {!isEditing && (
          <section className={styles.detailSection}>
            <div className={styles.detailGrid}>
              <div className={styles.detailField}>
                <span className={styles.detailLabel}>ID</span>
                <span className={styles.detailValue}>#{brand.id}</span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Nombre</span>
                <span className={styles.detailValue}>{brand.name}</span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Titular</span>
                <span className={styles.detailValue}>
                  {getHolderName(brand.holder_id)}
                </span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Estado</span>
                <span className={`${styles.statusBadge} ${getStatusBadgeClass(statusInfo.code)}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Fecha de Creación</span>
                <span className={styles.detailValue}>
                  {new Date(brand.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Última Actualización</span>
                <span className={styles.detailValue}>
                  {new Date(brand.updated_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {brand.description && (
                <div className={styles.detailDescription}>
                  <span className={styles.detailLabel}>Descripción</span>
                  <span className={styles.detailValue}>{brand.description}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}