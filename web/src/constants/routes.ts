export const routes = {
  list: '/list',
  login: '/login',
  settings: '/settings',
  trash: '/trash',
  completed: '/completed',
  newPassword: '/new-password',
  mfaVerify: '/mfa-verify',
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];

const PROTECTED_PATHS = [routes.list, routes.settings, routes.trash, routes.completed] as const;
const GUEST_PATHS = [routes.login, routes.newPassword, routes.mfaVerify] as const;

export const isProtectedPath = (pathname: string) =>
  PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));

export const isGuestPath = (pathname: string) =>
  GUEST_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
