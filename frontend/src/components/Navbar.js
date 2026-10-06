"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getUser, clearSession } from "@/lib/api";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setUser(getUser());
    setIsDark(document.documentElement.classList.contains("dark"));
  }, [pathname]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("revora_theme", next ? "dark" : "light");
  }

  function handleLogout() {
    clearSession();
    setUser(null);
    router.push("/");
  }

  const navLink =
    "text-xs tracking-widest uppercase font-[family-name:var(--font-geist-mono)] text-[var(--nav-text)]/60 hover:text-[var(--secondary)] transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-[var(--nav-bg)] relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-logo text-2xl text-[var(--nav-text)] tracking-wide"
        >
          Revora
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {user ? (
            <>
              <Link href="/dashboard" className={navLink}>Dashboard</Link>
              <Link href="/submissions/new" className={navLink}>Submit</Link>
              <Link href="/users" className={navLink}>Users</Link>
              <Link href="/profile" className={navLink}>Profile</Link>
            </>
          ) : (
            <>
              <span className={navLink + " normal-case tracking-normal opacity-50"}>
                // peer review, done right
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full border border-[var(--nav-text)]/15 flex items-center justify-center text-[var(--nav-text)] hover:border-[var(--secondary)] transition-colors text-sm"
          >
            {isDark ? "☀" : "☾"}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded-full border border-[var(--nav-text)]/20 text-[var(--nav-text)] hover:bg-[var(--nav-text)]/10 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline text-sm text-[var(--nav-text)]/80 hover:text-[var(--secondary)] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 text-sm rounded-full bg-[var(--primary)] text-[var(--primary-contrast)] font-medium hover:opacity-90 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      <div
        className="h-[2px] w-full"
        style={{
          background:
            "linear-gradient(90deg, var(--primary), var(--secondary))",
        }}
      />
    </nav>
  );
}
