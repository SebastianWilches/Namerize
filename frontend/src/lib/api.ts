import ky from "ky";

// Fallback para desarrollo local
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Debug: mostrar todas las variables de entorno que empiecen con NEXT_PUBLIC_
console.log("🔍 Debug variables de entorno:");
console.log("NEXT_PUBLIC_API_URL:", process.env.NEXT_PUBLIC_API_URL);
console.log("API_URL final:", API_URL);
console.log("Todas las env vars:", Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')));

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
