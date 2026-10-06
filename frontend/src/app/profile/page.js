"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getUser,
  saveUser,
  getUserById,
  updateName,
  changePassword,
  deleteUser,
  clearSession,
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

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [nameMsg, setNameMsg] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  useEffect(() => {
    const stored = getUser();
    if (!stored) {
      router.push("/login");
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const data = await getUserById(stored.id);
        if (cancelled) return;
        setProfile(data);
        setName(data.name);

        const allSubmissions = await getAllSubmissions();
        const mySubmissions = allSubmissions.filter(
          (s) => s.submittedByUsername === data.username
        );
        const myReviews = await getReviewedByUser(data.id);
        const commentLists = await Promise.all(
          allSubmissions.map((s) => getCommentsBySubmission(s.id))
        );
        const myComments = commentLists
          .flat()
          .filter((c) => c.createdByUsername === data.username);

        if (!cancelled) {
          setSubmissions(mySubmissions);
          setReviews(myReviews);
          setComments(myComments);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleNameUpdate(e) {
    e.preventDefault();
    setNameErr("");
    setNameMsg("");
    try {
      const updated = await updateName(profile.id, { name });
      setProfile(updated);
      saveUser(updated);
      setNameMsg("Name updated successfully.");
    } catch (err) {
      setNameErr(err.message);
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    setPwErr("");
    setPwMsg("");
    try {
      await changePassword(profile.id, { oldPassword, newPassword });
      setPwMsg("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      setPwErr(err.message);
    }
  }

  async function handleDeleteAccount() {
    if (!confirm("Delete your account permanently?")) return;
    try {
      await deleteUser(profile.id);
      clearSession();
      router.push("/");
    } catch (err) {
      setNameErr(err.message);
    }
  }

  if (loading) {
    return <p className="text-center py-16 text-[var(--text-muted)]">Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto w-full px-6 py-12 flex-1 flex flex-col gap-8">
      {/* Profile header */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 flex items-center gap-5 animate-fadeIn">
        <span className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold bg-[var(--secondary)] text-[var(--primary-contrast)]">
          {getInitials(profile.name)}
        </span>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-[var(--text)]">{profile.name}</h1>
          <p className="text-sm text-[var(--text-muted)]">
            @{profile.username} · {profile.email}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {profile.role?.map((r) => (
              <span
                key={r.id}
                className="text-xs font-medium bg-[var(--secondary)]/10 text-[var(--secondary)] px-2 py-1 rounded-full"
              >
                {r.name}
              </span>
            ))}
            <span className="text-xs text-[var(--text-muted)]">
              Joined {new Date(profile.createdAt).toLocaleDateString()}
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

      {/* My submissions */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">My Submissions</h2>
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

      {/* Update Name */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">Update Name</h2>
        {nameErr && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 mb-3">
            {nameErr}
          </p>
        )}
        {nameMsg && (
          <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2 mb-3">
            {nameMsg}
          </p>
        )}
        <form onSubmit={handleNameUpdate} className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="flex-1 border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-[var(--secondary)] text-white rounded-lg hover:opacity-90 transition"
          >
            Save
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-3">Change Password</h2>
        {pwErr && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 mb-3">
            {pwErr}
          </p>
        )}
        {pwMsg && (
          <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2 mb-3">
            {pwMsg}
          </p>
        )}
        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
          <button
            type="submit"
            className="self-start px-5 py-2 bg-[var(--secondary)] text-white rounded-lg hover:opacity-90 transition"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--surface)] border border-[var(--primary)]/20 rounded-xl shadow-sm p-6 animate-fadeIn">
        <h2 className="text-lg font-semibold text-[var(--primary)] mb-3">Danger Zone</h2>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-5 py-2 border border-[var(--primary)] text-[var(--primary)] rounded-lg hover:bg-[var(--primary)] hover:text-white transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
