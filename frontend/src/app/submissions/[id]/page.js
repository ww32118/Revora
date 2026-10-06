"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  getSubmissionById,
  updateCode,
  deleteCode,
  getCommentsBySubmission,
  addComment,
  likeComment,
  addReview,
  getUser,
  decodeId,
} from "@/lib/api";
import Select from "@/components/Select";

const STATUS_OPTIONS = ["OPEN", "IN_REVIEW", "CHANGES_REQUESTED", "MERGED", "CLOSED"].map(
  (s) => ({ value: s, label: s.replaceAll("_", " ") })
);
const DECISION_OPTIONS = ["APPROVED", "CHANGES_REQUESTED", "REJECTED"].map((d) => ({
  value: d,
  label: d.replaceAll("_", " "),
}));

const statusColors = {
  OPEN: "bg-[var(--secondary)]/10 text-[var(--secondary)]",
  IN_REVIEW: "bg-yellow-100 text-yellow-700",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-700",
  MERGED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-600",
};

export default function SubmissionDetailPage({ params }) {
  const { id: encodedId } = use(params);
  const id = decodeId(encodedId);
  const router = useRouter();
  const user = getUser();

  const [submission, setSubmission] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");

  const [reviewText, setReviewText] = useState("");
  const [decision, setDecision] = useState("APPROVED");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const [statusValue, setStatusValue] = useState("OPEN");

  function loadData() {
    if (id === null) {
      setError("Invalid submission link.");
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([getSubmissionById(id), getCommentsBySubmission(id)])
      .then(([sub, cmts]) => {
        setSubmission(sub);
        setStatusValue(sub.status);
        setComments(cmts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAddComment(e) {
    e.preventDefault();
    setCommentError("");
    if (!user) {
      setCommentError("You must be logged in to comment.");
      return;
    }
    try {
      await addComment({ userId: user.id, submissionId: Number(id), content: commentText });
      setCommentText("");
      const cmts = await getCommentsBySubmission(id);
      setComments(cmts);
    } catch (err) {
      setCommentError(err.message);
    }
  }

  async function handleLike(commentId) {
    try {
      await likeComment(commentId);
      const cmts = await getCommentsBySubmission(id);
      setComments(cmts);
    } catch (err) {
      setCommentError(err.message);
    }
  }

  async function handleAddReview(e) {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    if (!user) {
      setReviewError("You must be logged in to review.");
      return;
    }
    try {
      await addReview({
        userId: user.id,
        submissionId: Number(id),
        feedbackText: reviewText,
        decision,
      });
      setReviewText("");
      setReviewSuccess("Review submitted!");
    } catch (err) {
      setReviewError(err.message);
    }
  }

  async function handleStatusUpdate() {
    try {
      // NOTE: field names here must match your UpdateCodeRequest DTO exactly.
      await updateCode({
        submissionId: Number(id),
        title: submission.title,
        description: submission.description,
        programmingLanguage: submission.programmingLanguage,
        status: statusValue,
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this submission? This cannot be undone.")) return;
    try {
      await deleteCode(id);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <p className="text-center py-16 text-[var(--text-muted)]">Loading...</p>;
  }

  if (error && !submission) {
    return (
      <p className="text-center py-16 text-[var(--primary)]">{error}</p>
    );
  }

  const isOwner = user && submission && user.username === submission.submittedByUsername;
  const isAdmin = user?.role?.some((r) => r.name === "ROLE_ADMIN");
  const canManage = isOwner || isAdmin;

  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8">
      {error && (
        <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 animate-fadeIn">
          {error}
        </p>
      )}

      {/* Submission header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">{submission.title}</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              by {submission.submittedByUsername} · {submission.programmingLanguage}
            </p>
          </div>

          {canManage ? (
            <div className="flex items-center gap-2">
              <Select
                value={statusValue}
                onChange={(val) => setStatusValue(val)}
                options={STATUS_OPTIONS}
                className="w-44"
              />
              <button
                onClick={handleStatusUpdate}
                className="text-sm px-3 py-1 rounded-lg bg-[var(--secondary)] text-white hover:opacity-90 transition"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="text-sm px-3 py-1 rounded-lg border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition"
              >
                Delete
              </button>
            </div>
          ) : (
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
                statusColors[submission.status] || "bg-gray-100 text-gray-600"
              }`}
            >
              {submission.status?.replaceAll("_", " ")}
            </span>
          )}
        </div>

        <p className="text-[var(--text-muted)] mt-4">{submission.description}</p>

        <pre className="mt-4 bg-[var(--code-bg)] text-[var(--code-text)] text-sm rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
          <code>{submission.codeContent}</code>
        </pre>
      </div>

      {/* Reviews */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Add a Review</h2>

        {reviewError && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 mb-3">
            {reviewError}
          </p>
        )}
        {reviewSuccess && (
          <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2 mb-3">
            {reviewSuccess}
          </p>
        )}

        <form onSubmit={handleAddReview} className="flex flex-col gap-3">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Leave feedback for this submission..."
            rows={3}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
          <div className="flex items-center gap-3">
            <Select
              value={decision}
              onChange={(val) => setDecision(val)}
              options={DECISION_OPTIONS}
              className="w-48"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
          Comments ({comments.length})
        </h2>

        {commentError && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 mb-3">
            {commentError}
          </p>
        )}

        <form onSubmit={handleAddComment} className="flex gap-3 mb-6">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            required
            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-[var(--secondary)] text-white rounded-lg hover:opacity-90 transition"
          >
            Post
          </button>
        </form>

        <div className="flex flex-col gap-4">
          {comments.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">No comments yet.</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="border-b border-[var(--border)] pb-3 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text)]">
                  {c.createdByUsername}
                </span>
                <button
                  onClick={() => handleLike(c.id)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--primary)] transition"
                >
                  ♥ {c.likes}
                </button>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-1">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
