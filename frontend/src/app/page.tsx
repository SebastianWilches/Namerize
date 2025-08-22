"use client";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => getJSON<{ status: string }>("health"), // 👈 sin slash inicial
  });

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Namerize</h1>
      <div className="space-y-4">
        {isLoading && <p>Cargando estado del servidor…</p>}
        {isError && <p className="text-red-600">No se pudo conectar con el backend.</p>}
        {data && <p>Backend: {data.status}</p>}

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">
            Selecciona una opción en el menú de la izquierda para continuar.
          </p>
        </div>
      </div>
    </section>
  );
}
