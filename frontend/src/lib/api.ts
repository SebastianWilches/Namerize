import ky from "ky";

// Fallback para desarrollo local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Solo mostrar warning en desarrollo si no está configurada la variable
if (!process.env.NEXT_PUBLIC_API_URL && process.env.NODE_ENV === 'development') {
  console.warn("⚠️ NEXT_PUBLIC_API_URL no está definido, usando fallback:", API_URL);
}

if (!API_URL) {
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
export async function getJSON<T>(input: string, searchParams?: Record<string, string | number | boolean>): Promise<T> {
  const url = input.replace(/^\/+/, "");
  return searchParams 
    ? api.get(url, { searchParams }).json<T>()
    : api.get(url).json<T>();
}
export async function postJSON<T>(input: string, json: unknown): Promise<T> {
  return api.post(input.replace(/^\/+/, ""), { json }).json<T>();
}
export async function putJSON<T>(input: string, json: unknown): Promise<T> {
  return api.put(input.replace(/^\/+/, ""), { json }).json<T>();
}
export async function del(input: string): Promise<void> {
  await api.delete(input.replace(/^\/+/, ""));
}
