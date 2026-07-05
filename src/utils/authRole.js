const ROLE_CLAIM_KEYS = [
  "role",
  "roles",
  "Role",
  "Roles",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
];

const decodeJwtPayload = (token) => {
  if (!token || typeof token !== "string") return {};

  try {
    const payload = token.split(".")[1];
    if (!payload) return {};

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );
    return JSON.parse(window.atob(paddedPayload));
  } catch (error) {
    return {};
  }
};

export const getUserRoles = (userInfo = {}) => {
  const tokenPayload = decodeJwtPayload(userInfo?.token);
  const roleValue =
    ROLE_CLAIM_KEYS.map((key) => tokenPayload?.[key]).find(Boolean) ||
    userInfo?.roles ||
    userInfo?.user?.roles ||
    userInfo?.role ||
    userInfo?.user?.role ||
    "";

  const roles = Array.isArray(roleValue) ? roleValue : String(roleValue).split(",");
  return roles.map((role) => String(role).trim().toLowerCase()).filter(Boolean);
};

export const hasAnyRole = (userInfo = {}, allowedRoles = []) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;

  const userRoles = getUserRoles(userInfo);
  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).trim().toLowerCase()
  );

  return normalizedAllowedRoles.some((role) => userRoles.includes(role));
};
