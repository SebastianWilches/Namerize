import { getJSON } from "@/lib/api";
import type { Brand } from "@/types";

interface Params {
  params: { id: string };
}

export default async function BrandDetailPage({ params }: Params) {
  const { id } = params;
  let brand: Brand | null = null;
  try {
    brand = await getJSON<Brand>(`brands/${id}`);
  } catch (e) {
    // noop
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Detalle de marca</h2>
      {!brand ? (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">No se pudo cargar la marca con id {id}.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs uppercase text-gray-500">ID</dt>
              <dd className="font-medium">{brand.id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Nombre</dt>
              <dd className="font-medium">{brand.name}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Titular</dt>
              <dd className="font-medium">{brand.holder_id}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-gray-500">Estado</dt>
              <dd className="font-medium">{brand.status_id}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}
