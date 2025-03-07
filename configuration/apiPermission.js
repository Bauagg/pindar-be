export const apiPermissions = {
    "/api/user/update": ["CUSTOMER"],
    "/api/user/change-password": ["CUSTOMER"],
    "/api/user/profile": ["CUSTOMER"],
    "/api/auth/logout": ["ADMIN", "CUSTOMER", "CREATE"]
};
