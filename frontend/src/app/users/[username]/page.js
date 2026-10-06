"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  getAllUsers,
  getAllSubmissions,
  getReviewedByUser,
  getCommentsBySubmission,
  encodeId,
} from "@/lib/api";
import { getInitials } from "@/lib/avatar";

const statusColors = {
  OPEN: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
  IN_REVIEW: "bg-yellow-100 text-yellow-700",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-700",
  MERGED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-600",
};

export default function PublicProfilePage({ params }) {
  const { username } = use(params);

  const [profileUser, setProfileUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        // NOTE: there's no "get user by username" or "get comments by user"
        // endpoint on the backend yet, so this fetches everything and filters
        // client-side. Fine for a small dataset — worth adding dedicated
        // endpoints later if the user/submission list grows.
        const [allUsers, allSubmissions] = await Promise.all([
          getAllUsers(),
          getAllSubmissions(),
        ]);

        const foundUser = allUsers.find((u) => u.username === username);
        if (!foundUser) {
          if (!cancelled) {
            setError("User not found.");
            setLoading(false);
          }
          return;
        }

        const userSubmissions = allSubmissions.filter(
          (s) => s.submittedByUsername === username
        );

        const userReviews = await getReviewedByUser(foundUser.id);

        // Comments-by-user isn't a direct endpoint either, so we look across
        // every submission's comment list and keep the ones this user wrote.
        const commentLists = await Promise.all(
          allSubmissions.map((s) => getCommentsBySubmission(s.id))
        );
        const userComments = commentLists
          .flat()
          .filter((c) => c.createdByUsername === username);

        if (!cancelled) {
          setProfileUser(foundUser);
          setSubmissions(userSubmissions);
          setReviews(userReviews);
          setComments(userComments);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return <p className="text-center py-16 text-[var(--text-muted)]">Loading profile...</p>;
  }

  if (error || !profileUser) {
    return (
      <p className="text-center py-16 text-[var(--primary)]">
        {error || "User not found."}
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8">
      {/* Profile header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 flex items-center gap-5 animate-fadeIn">
        <span className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold bg-[var(--secondary)] text-[var(--primary-contrast)]">
          {getInitials(profileUser.name)}
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text)]">{profileUser.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            @{profileUser.username} · {profileUser.email}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {profileUser.role?.map((r) => (
              <span
                key={r.id}
                className="text-xs font-medium bg-[var(--secondary)]/10 text-[var(--secondary)] px-2 py-1 rounded-full"
              >
                {r.name}
              </span>
            ))}
            <span className="text-xs text-[var(--text-muted)]">
              Joined {new Date(profileUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 animate-fadeIn">
        {[
          { label: "Submissions", value: submissions.length },
          { label: "Reviews given", value: reviews.length },
          { label: "Comments", value: comments.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-center"
          >
            <p className="text-2xl font-bold text-[var(--text)]">{stat.value}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Submissions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Submissions</h2>
        {submissions.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No submissions yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {submissions.map((s) => (
            <Link
              key={s.id}
              href={`/submissions/${encodeId(s.id)}`}
              className="flex items-center justify-between gap-3 border border-[var(--border)] rounded-lg px-4 py-3 hover:border-[var(--secondary)] transition"
            >
              <div>
                <p className="font-medium text-[var(--text)]">{s.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.programmingLanguage}</p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                  statusColors[s.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {s.status?.replaceAll("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Reviews given</h2>
        {reviews.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No reviews yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {reviews.map((r) => (
            <Link
              key={r.id}
              href={`/submissions/${encodeId(r.submissionId)}`}
              className="block border border-[var(--border)] rounded-lg px-4 py-3 hover:border-[var(--secondary)] transition"
            >
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  r.decision === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : r.decision === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {r.decision?.replaceAll("_", " ")}
              </span>
              <p className="text-sm text-[var(--text-muted)] mt-2">{r.feedbackText}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Comments</h2>
        {comments.length === 0 && (
          <p className="text-sm text-[var(--text-muted)]">No comments yet.</p>
        )}
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <Link
              key={c.id}
              href={`/submissions/${encodeId(c.submissionId)}`}
              className="flex items-center justify-between gap-3 border border-[var(--border)] rounded-lg px-4 py-3 hover:border-[var(--secondary)] transition"
            >
              <p className="text-sm text-[var(--text-muted)]">{c.content}</p>
              <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                ♥ {c.likes}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
