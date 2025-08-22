import "./globals.css";
import Providers from "./providers";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata = {
  title: "Namerize",
  description: "Brand Registry UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
