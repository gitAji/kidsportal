// Maps Firebase Auth error codes to short, parent-friendly messages.
// Firebase's raw err.message (e.g. "Firebase: Error (auth/network-request-failed).")
// is internal/debug-oriented and confusing to show directly to users.
const FRIENDLY_AUTH_ERRORS = {
  "auth/email-already-in-use": "An account already exists with this email. Try logging in instead.",
  "auth/invalid-email": "That email address doesn't look right. Please check and try again.",
  "auth/weak-password": "Please choose a stronger password (at least 6 characters).",
  "auth/wrong-password": "Incorrect email or password. Please try again.",
  "auth/user-not-found": "We couldn't find an account with that email.",
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "We couldn't reach the server. Please check your connection and try again.",
  "auth/popup-closed-by-user": "Sign-in was cancelled before it finished.",
  "auth/user-disabled": "This account has been disabled. Please contact support.",
};

export function getFriendlyAuthError(err) {
  if (err?.message === "TEACHER_PROHIBITED") return err.message; // handled separately by callers
  if (err?.code && FRIENDLY_AUTH_ERRORS[err.code]) return FRIENDLY_AUTH_ERRORS[err.code];
  // A Firebase Auth code we haven't mapped: still better than the raw
  // "Firebase: Error (auth/xyz)." text, but don't guess at wording.
  if (err?.code?.startsWith("auth/")) return "Something went wrong. Please try again.";
  // Not a Firebase Auth error (e.g. the student-login API's own thrown
  // Error with a purpose-written message) — keep it as-is.
  return err?.message || "Something went wrong. Please try again.";
}
