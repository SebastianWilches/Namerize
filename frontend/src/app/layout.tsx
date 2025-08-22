import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Namerize",
  description: "Brand Registry UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <main className="mx-auto max-w-5xl p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
