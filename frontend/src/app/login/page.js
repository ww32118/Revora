"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, saveToken, saveUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(form);
      saveToken(data.token);
      saveUser(data.user);
      router.push("/dashboard");
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
        <h1 className="text-2xl font-bold text-[var(--text)] mb-2">Login</h1>

        {error && (
          <p className="text-sm text-[var(--primary)] bg-[var(--primary)]/10 rounded-md px-3 py-2">
            {error}
          </p>
        )}

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

        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-3 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-center text-[var(--text-muted)]">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-[var(--secondary)] font-medium">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
