"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addCode, getUser, encodeId } from "@/lib/api";

export default function NewSubmissionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    codeContent: "",
    programmingLanguage: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false); // guards against rapid double-clicks

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // React state updates aren't instant, so a fast double-click can slip
    // through before `loading` re-renders the disabled button. This ref
    // flips synchronously on the very first click and blocks any repeat.
    if (submittingRef.current) return;
    submittingRef.current = true;

    setError("");

    const user = getUser();
    if (!user) {
      setError("You must be logged in to submit code.");
      submittingRef.current = false;
      return;
    }

    setLoading(true);
    try {
      const created = await addCode({ userId: user.id, ...form });
      router.push(`/submissions/${encodeId(created.id)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-12 flex-1">
      <h1 className="text-3xl font-bold text-[var(--text)] mb-8 animate-fadeIn">
        Submit Code for Review
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-8 flex flex-col gap-4 animate-fadeIn"
      >
        {error && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">
            Programming Language
          </label>
          <input
            name="programmingLanguage"
            value={form.programmingLanguage}
            onChange={handleChange}
            placeholder="e.g. Java, JavaScript, Python"
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Code</label>
          <textarea
            name="codeContent"
            value={form.codeContent}
            onChange={handleChange}
            rows={10}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 self-start"
        >
          {loading ? "Submitting..." : "Submit Code"}
        </button>
      </form>
    </div>
  );
}
