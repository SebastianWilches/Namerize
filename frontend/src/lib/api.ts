import ky from "ky";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  // Esto se resuelve en build; si ves este error en consola, el .env no fue tomado.
  throw new Error(
    "NEXT_PUBLIC_API_URL no está definido. Crea frontend/.env.local y reinicia el servidor."
  );
}

export const api = ky.create({
  prefixUrl: API_URL.replace(/\/+$/, ""), // quita slash final por seguridad
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set("Content-Type", "application/json");
      },
    ],
  },
});

// Helpers: usa rutas relativas sin "/" al inicio
export async function getJSON<T>(input: string, searchParams?: Record<string, any>): Promise<T> {
  return api.get(input.replace(/^\/+/, ""), { searchParams }).json<T>();
}
export async function postJSON<T>(input: string, json: any): Promise<T> {
  return api.post(input.replace(/^\/+/, ""), { json }).json<T>();
}
export async function putJSON<T>(input: string, json: any): Promise<T> {
  return api.put(input.replace(/^\/+/, ""), { json }).json<T>();
}
export async function del(input: string): Promise<void> {
  await api.delete(input.replace(/^\/+/, ""));
}
