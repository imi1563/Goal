export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: [USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.USER],
  [USER_ROLES.MANAGER]: [USER_ROLES.MANAGER, USER_ROLES.USER],
  [USER_ROLES.USER]: [USER_ROLES.USER]
};

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  USERS: '/api/users',
  ANALYTICS: '/api/analytics'
};
