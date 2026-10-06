"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom themed dropdown — replaces native <select>, whose <option> list
 * ignores most CSS and looks broken in dark mode.
 *
 * Usage:
 * <Select
 *   value={value}
 *   onChange={(val) => setValue(val)}
 *   options={[{ value: "ROLE_USER", label: "User" }, ...]}
 * />
 */
export default function Select({ value, onChange, options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function handleEscape(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-[var(--surface-muted)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary)] transition"
      >
        <span>{selected ? selected.label : "Select..."}</span>
        <span
          className={`text-[var(--text-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="absolute z-20 mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] shadow-lg overflow-hidden py-1 max-h-56 overflow-y-auto">
          {options.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--secondary)] hover:text-[var(--primary-contrast)] transition-colors ${
                  o.value === value ? "bg-[var(--secondary)]/15" : ""
                }`}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
