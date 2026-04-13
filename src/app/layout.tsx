import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";
import Navigation from "./navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wordkeep — Chinese Vocabulary Journal",
  description: "A personal Chinese vocabulary journal for retention and review",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Providers>
            <Navigation />
            <main className="flex-1 max-w-6xl mx-auto w-full px-5 sm:px-8 py-10">
              {children}
            </main>
            <footer className="border-t border-border py-8 text-center">
              <p className="text-sm text-muted">
                Wordkeep — Built for learning Chinese, one word at a time.
              </p>
            </footer>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
