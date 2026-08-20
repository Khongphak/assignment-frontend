let _accessToken: string | null = null;

export function getToken(): string | null { return _accessToken; }
export function setToken(token: string): void { _accessToken = token; }
export function clearToken(): void { _accessToken = null; }
