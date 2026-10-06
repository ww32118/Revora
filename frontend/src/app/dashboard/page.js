"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllSubmissions, encodeId } from "@/lib/api";

const statusColors = {
  OPEN: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
  IN_REVIEW: "bg-yellow-100 text-yellow-700",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-700",
  MERGED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-600",
};

export default function DashboardPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllSubmissions()
      .then(setSubmissions)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full px-6 py-12 flex-1">
      <div className="flex items-center justify-between mb-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-[var(--text)]">Code Submissions</h1>
        <Link
          href="/submissions/new"
          className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition"
        >
          + New Submission
        </Link>
      </div>

      {loading && <p className="text-[var(--text-muted)]">Loading submissions...</p>}
      {error && (
        <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      {!loading && submissions.length === 0 && !error && (
        <p className="text-[var(--text-muted)]">
          No submissions yet. Be the first to submit code for review.
        </p>
      )}

      <div className="grid sm:grid-cols-2 gap-5">
        {submissions.map((s, idx) => (
          <Link
            key={s.id}
            href={`/submissions/${encodeId(s.id)}`}
            className="block bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-5 hover:shadow-md transition animate-fadeIn"
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold text-[var(--text)] line-clamp-1">
                {s.title}
              </h2>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  statusColors[s.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {s.status?.replaceAll("_", " ")}
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
              {s.description}
            </p>
            <div className="flex items-center justify-between mt-4 text-xs text-[var(--text-muted)]">
              <span>by {s.submittedByUsername}</span>
              <span>{s.programmingLanguage}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
