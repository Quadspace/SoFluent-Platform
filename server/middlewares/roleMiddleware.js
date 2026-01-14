/**
 * Role-Based Access Control Middleware
 * 3-Tier Platform: Enforces role-based permissions
 */

/**
 * Require specific role(s) to access route
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export const requireRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.auth?.userId;
            
            if (!userId) {
                return res.json({ success: false, message: 'Authentication required' });
            }

            // Get user from database
            const User = (await import('../models/User.js')).default;
            const dbAdapter = (await import('../configs/database-adapter.js')).default;
            
            const user = await dbAdapter.findOne(User, { clerkId: userId });
            
            if (!user) {
                return res.json({ success: false, message: 'User not found' });
            }

            // Check if user has required role
            if (!allowedRoles.includes(user.role)) {
                return res.json({ 
                    success: false, 
                    message: 'Access denied. Insufficient permissions.' 
                });
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.json({ success: false, message: error.message });
        }
    };
};

/**
 * Require Master Admin only
 */
export const requireMasterAdmin = requireRole(['master_admin']);

/**
 * Require Teacher or Master Admin
 */
export const requireTeacher = requireRole(['teacher', 'master_admin']);

/**
 * Require Student or higher
 */
export const requireStudent = requireRole(['student', 'teacher', 'master_admin']);

export default {
    requireRole,
    requireMasterAdmin,
    requireTeacher,
    requireStudent
};
