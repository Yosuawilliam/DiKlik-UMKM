import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DiKlik UMKM",
  description: "Belajar keahlian baru bersama DiKlik UMKM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 selection:bg-emerald-500/30 selection:text-emerald-900 min-h-screen flex flex-col`}>
        <AppProvider>
          <Header />
          <main className="grow">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}