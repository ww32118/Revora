"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, updateRole, getUser } from "@/lib/api";
import { getInitials } from "@/lib/avatar";
import Select from "@/components/Select";

const ROLE_OPTIONS = [
  { value: "ROLE_USER", label: "User" },
  { value: "ROLE_ADMIN", label: "Admin" },
];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [roleValue, setRoleValue] = useState("ROLE_USER");
  const me = getUser();
  const isAdmin = me?.role?.some((r) => r.name === "ROLE_ADMIN");

  function loadUsers() {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleUpdate(id) {
    try {
      await updateRole(id, { role: [{ name: roleValue }] });
      setEditingId(null);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
      <h1 className="text-3xl font-bold text-[var(--text)] mb-8 animate-fadeIn">
        Users
      </h1>

      {loading && <p className="text-[var(--text-muted)]">Loading users...</p>}
      {error && (
        <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm divide-y divide-[var(--border)] animate-fadeIn">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-5 py-4 flex-wrap gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold bg-[var(--secondary)] text-[var(--primary-contrast)]">
                {getInitials(u.name)}
              </span>
              <div>
                <p className="font-medium text-[var(--text)]">{u.name}</p>
                <p className="text-sm text-[var(--text-muted)]">
                  @{u.username} · {u.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-medium bg-[var(--secondary)]/10 text-[var(--secondary)] px-2 py-1 rounded-full">
                {u.role?.map((r) => r.name).join(", ")}
              </span>

              <Link
                href={`/users/${u.username}`}
                className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text)] hover:border-[var(--secondary)] transition"
              >
                View Profile
              </Link>

              {/* Following is not implemented on the backend yet — this is a visible
                  placeholder, not a working feature, so it doesn't pretend to do something it can't. */}
              <button
                type="button"
                disabled
                title="Following isn't available yet — coming in a future update"
                className="text-sm px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] opacity-50 cursor-not-allowed"
              >
                Follow
              </button>

              {isAdmin && (
                editingId === u.id ? (
                  <div className="flex items-center gap-2">
                    <Select
                      value={roleValue}
                      onChange={setRoleValue}
                      options={ROLE_OPTIONS}
                      className="w-32"
                    />
                    <button
                      onClick={() => handleRoleUpdate(u.id)}
                      className="text-sm px-3 py-1 rounded-lg bg-[var(--secondary)] text-white hover:opacity-90 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-sm px-3 py-1 rounded-lg border border-[var(--border)] text-[var(--text-muted)]"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(u.id);
                      setRoleValue(u.role?.[0]?.name || "ROLE_USER");
                    }}
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    Edit Role
                  </button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
