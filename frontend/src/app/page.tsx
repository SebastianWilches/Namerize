"use client";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

export default function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["health"],
    queryFn: () => getJSON<{ status: string }>("health"), // 👈 sin slash inicial
  });

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Namerize</h1>
      {isLoading && <p>Cargando estado del servidor…</p>}
      {isError && <p className="text-red-600">No se pudo conectar con el backend.</p>}
      {data && <p>Backend: {data.status}</p>}

      <div className="grid gap-3 sm:grid-cols-3">
        <a className="rounded-lg border p-4 hover:bg-white" href="/brands">Marcas</a>
        <a className="rounded-lg border p-4 hover:bg-white" href="/holders">Titulares</a>
        <a className="rounded-lg border p-4 hover:bg-white" href="/statuses">Estados</a>
      </div>
    </section>
  );
}
