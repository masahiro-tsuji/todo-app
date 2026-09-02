export const DEFAULT_AUTH_PATH = '/list';
export const DEFAULT_GUEST_PATH = '/login';
export const SETTINGS_PATH = '/settings';
const NEW_PASSWORD_PATH = '/new-password';
const MFA_VERIFY_PATH = '/mfa-verify';

const PROTECTED_PATHS = [DEFAULT_AUTH_PATH, SETTINGS_PATH] as const;
const GUEST_PATHS = [DEFAULT_GUEST_PATH, NEW_PASSWORD_PATH, MFA_VERIFY_PATH] as const;

export const isProtectedPath = (pathname: string) =>
  PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const isGuestPath = (pathname: string) =>
  GUEST_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
