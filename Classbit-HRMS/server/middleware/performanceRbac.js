/**
 * RBAC Middleware specifically for Performance Dashboard Routes
 * Defines roles: EMPLOYEE, HR_MANAGER, SUPER_ADMIN
 */

const performanceRbac = (requiredRoles = []) => {
    return (req, res, next) => {
        try {
            // Assume req.user is populated by a prior authentication middleware (e.g., JWT verify)
            if (!req.user || !req.user.role) {
                return res.status(401).json({ message: 'Unauthorized. Please log in.' });
            }

            const userRole = req.user.role.toUpperCase(); // Ensure standard comparison

            // Roles Map matching the prompt's explicit naming convention
            // Note: In a real system, these might map to existing DB strings like 'Super Admin', 'HR', 'Employee'
            const validRoles = ['EMPLOYEE', 'HR_MANAGER', 'SUPER_ADMIN'];
            if (!validRoles.includes(userRole)) {
                return res.status(403).json({ message: '403 Forbidden: Invalid role structure.' });
            }

            // If no specific roles are required, allow passage (default open route)
            if (requiredRoles.length === 0) return next();

            // Check if the user's role is in the array of allowed roles
            if (requiredRoles.includes(userRole)) {
                return next(); // Authorized
            }

            // If not authorized for this specific route Action
            return res.status(403).json({ 
                message: `403 Forbidden: Your role '${userRole}' does not have permission to access this resource.` 
            });

        } catch (error) {
            console.error('RBAC Error:', error);
            res.status(500).json({ message: 'Internal Server Error during authorization verification.' });
        }
    };
};

module.exports = { performanceRbac };

/* 
* Example Usage in Routes (as per the prompt):
* 
* const router = express.Router();
* const { performanceRbac } = require('../middleware/performanceRbac');
*
* // Employees can only access GET /api/performance/me
* router.get('/me', performanceRbac(['EMPLOYEE', 'HR_MANAGER', 'SUPER_ADMIN']), getMyPerformance);
*
* // HR can access POST /api/performance/appraisal
* router.post('/appraisal', performanceRbac(['HR_MANAGER', 'SUPER_ADMIN']), postAppraisal);
* 
* // Super Admins can access DELETE and GET /api/performance/all-reports
* router.get('/all-reports', performanceRbac(['SUPER_ADMIN']), getAllReports);
* router.delete('/:id', performanceRbac(['SUPER_ADMIN']), deleteReport);
* 
*/
