import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La Pizarra | Predicciones Mundial 2026",
  description: "Domina el fixture, desafía a la élite y demuestra tu conocimiento táctico en la plataforma definitiva de predicciones para la Copa del Mundo 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="es"
        className={`${oswald.variable} ${inter.variable} h-full antialiased dark`}
      >
        <body className="min-h-full flex flex-col font-inter bg-slate-950 text-slate-100 selection:bg-cyan-500/30 overflow-x-hidden">
          {/* Fondo Radial Sutil */}
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-from)_0%,_transparent_40%),radial-gradient(circle_at_bottom_left,_var(--tw-gradient-to)_0%,_transparent_40%)] from-purple-900/20 to-cyan-900/20"></div>
          
          <main className="flex-1">
            {children}
          </main>
          
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
