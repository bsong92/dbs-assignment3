"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/discover", label: "Discover" },
  { href: "/add", label: "Add Word" },
  { href: "/vocab", label: "Vocabulary" },
  { href: "/review", label: "Review" },
  { href: "/practice", label: "Practice" },
  { href: "/progress", label: "Progress" },
];

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/wordkeep-logo.jpeg"
              alt="Wordkeep logo"
              width={32}
              height={32}
              className="rounded-lg group-hover:scale-110 transition-transform"
            />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Wordkeep
            </span>
          </Link>
          <div className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? "text-primary bg-primary-light"
                    : "text-muted hover:text-foreground hover:bg-stone-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-3 pl-3 border-l border-border flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton>
                  <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:text-foreground hover:bg-stone-100 transition-all duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-green-700 transition-all duration-200">
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
