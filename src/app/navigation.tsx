"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/add", label: "Add" },
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
    <nav className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="font-display italic text-2xl text-foreground tracking-tight">
              Wordkeep
            </span>
            <span className="eyebrow hidden sm:inline opacity-70 group-hover:opacity-100 transition-opacity">
              · 词库
            </span>
          </Link>

          <div className="flex items-center">
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-1.5 text-[0.85rem] tracking-wide font-medium transition-colors ${
                      active
                        ? "text-primary"
                        : "text-muted-strong hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-primary" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="ml-3 md:ml-5 pl-3 md:pl-5 border-l border-border flex items-center gap-2">
              <Show when="signed-out">
                <SignInButton>
                  <button className="px-3 py-1.5 rounded-md text-[0.85rem] tracking-wide font-medium text-muted-strong hover:text-foreground transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="px-3.5 py-1.5 rounded-md text-[0.85rem] tracking-wide font-semibold text-surface bg-foreground hover:bg-muted-strong transition-colors">
                    Sign up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8 ring-1 ring-border",
                    },
                  }}
                />
              </Show>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
