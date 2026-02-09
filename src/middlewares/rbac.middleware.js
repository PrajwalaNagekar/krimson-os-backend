/**
 * RBAC Authorization Middleware
 * 
 * This middleware checks if the authenticated user has the required permission.
 * It assumes that 'req.user' is populated by an authentication middleware (e.g., JWT)
 * and contains a 'permissions' array.
 * 
 * @param {string} requiredPermission - The permission string to check for (e.g., 'incident:create')
 */
export const authorize = (requiredPermission) => {
    return (req, res, next) => {
        try {
            const user = req.user;

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required. User not found in request.',
                });
            }

            const permissions = user.permissions || [];

            // Check if the user has the required permission
            const hasPermission = permissions.includes(requiredPermission);

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: `Forbidden: You do not have the required permission (${requiredPermission}) to access this resource.`,
                });
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
