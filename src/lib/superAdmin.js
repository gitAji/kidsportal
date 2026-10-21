// Single source of truth for who counts as a super admin by email whitelist.
// Used by both the client-side SuperAdminGuard and server-side API route
// verification, so the two can't drift out of sync.
export const SUPER_ADMIN_EMAILS = [
    "kontaktaone@gmail.com",
];
