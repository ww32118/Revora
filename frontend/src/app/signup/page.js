"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";
import Select from "@/components/Select";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "ROLE_USER",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser(form);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-sm p-8 flex flex-col gap-4 animate-fadeIn"
      >
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Create Account</h1>

        {error && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
            Account created! Redirecting to login...
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="border border-[var(--border)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--secondary)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--text-muted)]">Role</label>
          <Select
            value={form.role}
            onChange={(val) => setForm({ ...form, role: val })}
            options={[
              { value: "ROLE_USER", label: "User" },
              { value: "ROLE_ADMIN", label: "Admin" },
            ]}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="text-sm text-center text-[var(--text-muted)]">
          Already have an account?{" "}
          <a href="/login" className="text-[var(--secondary)] font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
