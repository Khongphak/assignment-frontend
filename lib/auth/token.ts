// Token storage: uses localStorage for the FE-2 mock.
//
// Assumption — production replacement (FE-3):
//   Replace this module with a server-action-based approach where POST /staff/login
//   is called from a Next.js server action that sets an httpOnly cookie, so the
//   raw JWT never touches JavaScript. The calling code (useStaffAuth, getToken guard)
//   does not need to change — only this module.

const TOKEN_KEY = 'staff_access_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}
