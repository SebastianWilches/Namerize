import "./globals.css";
import Providers from "./providers";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Namerize",
  description: "Brand Registry UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <div className="mx-auto max-w-5xl p-6 grid gap-6 md:grid-cols-[220px_1fr]">
            <Sidebar />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
