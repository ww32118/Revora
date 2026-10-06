export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* ---------- Hero ---------- */}
      <section className="max-w-6xl mx-auto w-full px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
        <div className="flex flex-col gap-5">
          <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-widest uppercase text-[var(--secondary)] animate-fadeIn">
            // peer code review
          </span>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight text-[var(--text)] animate-fadeIn-delay-1">
            Ship code your team{" "}
            <span className="font-logo text-[var(--primary)] normal-case">
              actually
            </span>{" "}
            reviews.
          </h1>

          <p className="text-lg text-[var(--text-muted)] max-w-md animate-fadeIn-delay-2">
            Revora turns code submissions into real conversations — inline
            comments, honest verdicts, and a paper trail your team can trust.
          </p>

          <div className="flex gap-4 mt-2 animate-fadeIn-delay-3">
            <a
              href="/signup"
              className="px-6 py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-contrast)] font-medium hover:opacity-90 transition"
            >
              Start reviewing
            </a>
            <a
              href="/login"
              className="px-6 py-3 rounded-lg border border-[var(--secondary)] text-[var(--secondary)] font-medium hover:bg-[var(--secondary)] hover:text-[var(--primary-contrast)] transition"
            >
              Login
            </a>
          </div>
        </div>

        {/* ---------- Signature element: annotated code review card ---------- */}
        <div className="relative animate-fadeIn-delay-2">
          <div
            className="absolute -top-4 -right-3 z-10 rotate-3 px-3 py-1.5 rounded-full text-xs font-medium border bg-[var(--surface)] text-[var(--secondary)] border-[var(--secondary)] shadow-sm"
          >
            ✓ Approved by 2 reviewers
          </div>

          <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-lg">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[var(--surface-muted)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary)] opacity-70" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--text-muted)] opacity-40" />
              <span className="ml-3 text-xs font-[family-name:var(--font-geist-mono)] text-[var(--text-muted)]">
                fix-login-bug.js
              </span>
            </div>

            <pre className="bg-[var(--code-bg)] text-[var(--code-text)] text-sm px-5 py-5 font-[family-name:var(--font-geist-mono)] leading-6 overflow-x-auto">
{`function validateLogin(user) {
  if (!user.email) return false;
`}<span className="border-b-2 border-dotted border-[var(--primary)]">{`  if (!user.password) return false;
`}</span>{`  return checkHash(user.password);
}`}
            </pre>

            <div className="bg-[var(--surface)] border-t border-[var(--border)] px-5 py-4 flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold bg-[var(--secondary)] text-[var(--primary-contrast)]">
                P
              </span>
              <div className="text-sm">
                <p className="font-medium text-[var(--text)]">
                  Priya · <span className="font-normal text-[var(--text-muted)]">2m ago</span>
                </p>
                <p className="text-[var(--text-muted)]">
                  Extract this validation into a helper — it&apos;s repeated in 3 places.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- How it works (genuine 3-step flow) ---------- */}
      <section className="border-t border-[var(--border)] bg-[var(--surface-muted)]">
        <div className="max-w-6xl mx-auto w-full px-6 py-16 grid sm:grid-cols-3 gap-10">
          {[
            {
              n: "01",
              title: "Submit",
              copy: "Paste your code with a title, description, and language — no repo setup required.",
            },
            {
              n: "02",
              title: "Review",
              copy: "Teammates leave inline comments and a clear verdict: approved, changes requested, or rejected.",
            },
            {
              n: "03",
              title: "Resolve",
              copy: "Track status from open to merged, with the full comment and review history in one place.",
            },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-2">
              <span className="font-[family-name:var(--font-geist-mono)] text-sm text-[var(--secondary)]">
                {step.n}
              </span>
              <h3 className="text-lg font-semibold text-[var(--text)]">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--text-muted)]">{step.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
