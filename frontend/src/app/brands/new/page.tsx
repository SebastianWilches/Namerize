"use client";
import { useForm } from "react-hook-form";
import { postJSON } from "@/lib/api";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  description?: string;
  holder_id: number;
  status_id: number;
};

export default function NewBrandPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    await postJSON("/brands", { ...data, holder_id: Number(data.holder_id), status_id: Number(data.status_id) });
    router.push("/brands");
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">Nueva marca</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 max-w-lg">
        <label className="grid gap-1">
          <span>Nombre *</span>
          <input className="rounded-md border px-3 py-2" {...register("name", { required: true })} />
          {errors.name && <small className="text-red-600">Requerido</small>}
        </label>

        <label className="grid gap-1">
          <span>Descripción</span>
          <textarea className="rounded-md border px-3 py-2" {...register("description")} />
        </label>

        <label className="grid gap-1">
          <span>Holder ID *</span>
          <input type="number" className="rounded-md border px-3 py-2" {...register("holder_id", { required: true, valueAsNumber: true })} />
          {errors.holder_id && <small className="text-red-600">Requerido</small>}
        </label>

        <label className="grid gap-1">
          <span>Status ID *</span>
          <input type="number" className="rounded-md border px-3 py-2" {...register("status_id", { required: true, valueAsNumber: true })} />
          {errors.status_id && <small className="text-red-600">Requerido</small>}
        </label>

        <button disabled={isSubmitting} className="rounded-md border px-4 py-2 disabled:opacity-50">
          {isSubmitting ? "Guardando…" : "Crear"}
        </button>
      </form>
    </section>
  );
}
