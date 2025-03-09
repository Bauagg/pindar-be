export const apiPermissions = {
    "/api/user/update": ["CUSTOMER"],
    "/api/user/change-password": ["CUSTOMER"],
    "/api/user/profile": ["CUSTOMER"],
    "/api/auth/logout": ["ADMIN", "CUSTOMER", "CREATE"],
    "/api/file/image": ["ADMIN", "CUSTOMER", "CREATE"],
    "/api/lender/add": ["ADMIN", "CUSTOMER", "CREATE"],
    "/api/lender/update": ["ADMIN", "CUSTOMER", "CREATE"],
    "/api/lender/delete/:id": ["ADMIN", "CUSTOMER", "CREATE"]
};
