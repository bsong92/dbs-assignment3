import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Noto_Serif_SC } from "next/font/google";
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

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap",
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
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${notoSerifSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <Providers>
            <Navigation />
            <main className="flex-1 max-w-5xl mx-auto w-full px-5 sm:px-8 py-12 sm:py-16">
              {children}
            </main>
            <footer className="border-t border-border mt-16">
              <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="font-display italic text-muted-strong text-lg">
                  Wordkeep
                </p>
                <p className="text-xs tracking-[0.15em] uppercase text-muted">
                  A journal for the patient student
                </p>
              </div>
            </footer>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
