export const DEFAULT_AUTH_PATH = '/list';
export const DEFAULT_GUEST_PATH = '/login';
const NEW_PASSWORD_PATH = '/new-password';

const PROTECTED_PATHS = [DEFAULT_AUTH_PATH] as const;
const GUEST_PATHS = [DEFAULT_GUEST_PATH, NEW_PASSWORD_PATH] as const;

export const isProtectedPath = (pathname: string) =>
  PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const isGuestPath = (pathname: string) =>
  GUEST_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
