"use client";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getJSON, del } from "@/lib/api";
import type { Brand, Paginated } from "@/types";
import Link from "next/link";

export default function BrandsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useQuery<Paginated<Brand>>({
    queryKey: ["brands", { search, page, pageSize }],
    queryFn: () => {
      const params: Record<string, any> = { page, page_size: pageSize };
      const trimmed = search.trim();
      if (trimmed !== "") {
        params.search = trimmed; // 👈 solo se envía si hay filtro
      }
      return getJSON<Paginated<Brand>>("brands", params); // 👈 sin slash inicial
    },
    placeholderData: keepPreviousData,
  });

  async function handleDelete(id: number) {
    await del(`brands/${id}`); // 👈 sin slash inicial
    refetch();
  }

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold">Marcas</h2>
        <Link href="/brands/new" className="rounded-md border px-3 py-2">Nueva marca</Link>
      </header>

      <div className="flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar…"
          className="flex-1 rounded-md border px-3 py-2"
        />
        <button onClick={() => setPage(1)} className="rounded-md border px-3 py-2">
          Aplicar
        </button>
      </div>

      {isLoading && <p>Cargando…</p>}
      {isError && <p className="text-red-600">Error cargando marcas.</p>}

      {data ? (
        <>
          <table className="w-full border-collapse rounded-md border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Holder</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-2">{b.id}</td>
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.holder_id}</td>
                  <td className="p-2">{b.status_id}</td>
                  <td className="p-2">
                    <Link className="mr-2 underline" href={`/brands/${b.id}`}>Ver</Link>
                    <button className="text-red-600 underline" onClick={() => handleDelete(b.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr><td className="p-3" colSpan={5}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border px-3 py-2 disabled:opacity-50"
            >
              Anterior
            </button>
            <span>
              Página {data.page} / {Math.max(1, Math.ceil(data.total / data.page_size))}
            </span>
            <button
              disabled={data.page * data.page_size >= data.total}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border px-3 py-2 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}
