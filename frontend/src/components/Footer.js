export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-[var(--text-muted)]">
        <p className="font-logo text-base text-[var(--text)]">Revora</p>
        <p>© {new Date().getFullYear()} Revora. Built for collaborative code review.</p>
      </div>
    </footer>
  );
}
