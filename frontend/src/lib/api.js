// src/lib/api.js
// Central place for all backend API calls.
// Base URL of your Spring Boot backend.
const BASE_URL = "http://localhost:8080";

// ---- Token helpers (JWT is stored in localStorage on the client) ----
export function saveToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("revora_token", token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("revora_token");
  }
  return null;
}

export function saveUser(user) {
  if (typeof window !== "undefined") {
    localStorage.setItem("revora_user", JSON.stringify(user));
  }
}

export function getUser() {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("revora_user");
    return raw ? JSON.parse(raw) : null;
  }
  return null;
}

export function clearSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("revora_token");
    localStorage.removeItem("revora_user");
  }
}

// ---- Cosmetic ID obfuscation for URLs (NOT real security — reversible in 1 line) ----
export function encodeId(id) {
  return btoa(String(id)).replace(/=+$/, "");
}

export function decodeId(encoded) {
  try {
    const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
    const num = Number(atob(padded));
    return Number.isNaN(num) ? null : num;
  } catch {
    return null;
  }
}

// ---- Generic request helper ----
async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // DELETE endpoints often return no body
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || "Something went wrong";
    throw new Error(message);
  }

  return data;
}

// ---------------- USER ENDPOINTS ----------------
export const registerUser = (payload) =>
  request("/users/register", { method: "POST", body: payload, auth: false });

export const loginUser = (payload) =>
  request("/users/login", { method: "POST", body: payload, auth: false });

export const getUserById = (id) => request(`/users/${id}`);

export const getAllUsers = () => request("/users");

export const updateUser = (id, payload) =>
  request(`/users/${id}`, { method: "PUT", body: payload });

export const updateName = (id, payload) =>
  request(`/users/${id}/name`, { method: "PUT", body: payload });

export const changePassword = (id, payload) =>
  request(`/users/${id}/change-password`, { method: "PUT", body: payload });

export const updateRole = (id, payload) =>
  request(`/users/${id}/update-role`, { method: "PUT", body: payload });

export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });

// ---------------- CODE SUBMISSION ENDPOINTS ----------------
export const getAllSubmissions = () => request("/code-submissions");

export const getSubmissionById = (id) => request(`/code-submissions/${id}`);

export const addCode = (payload) =>
  request("/code-submissions/add-code", { method: "POST", body: payload });

// NOTE: verify this matches your CodeSubmissionController's exact route + DTO shape
// (UpdateCodeRequest carries submissionId in the body per your backend).
export const updateCode = (payload) =>
  request(`/code-submissions/update-code`, {
    method: "PUT",
    body: payload,
  });

export const deleteCode = (submissionId) =>
  request(`/code-submissions/${submissionId}`, { method: "DELETE" });

// ---------------- COMMENT ENDPOINTS ----------------
export const getCommentsBySubmission = (submissionId) =>
  request(`/comments/${submissionId}/comments`);

export const addComment = (payload) =>
  request("/comments/add", { method: "POST", body: payload });

export const updateComment = (id, content) =>
  request(`/comments/update/${id}?content=${encodeURIComponent(content)}`, {
    method: "PUT",
  });

export const deleteComment = (id) => request(`/comments/${id}`, { method: "DELETE" });

export const likeComment = (id) => request(`/comments/${id}/like`, { method: "PUT" });

// ---------------- REVIEW ENDPOINTS ----------------
export const addReview = (payload) =>
  request("/reviews/addreview", { method: "POST", body: payload });

export const updateReview = (id, payload) =>
  request(`/reviews/${id}/updatereview`, { method: "PUT", body: payload });

export const deleteReview = (id) => request(`/reviews/${id}`, { method: "DELETE" });

export const getReviewedByUser = (id) => request(`/reviews/users/${id}`);
