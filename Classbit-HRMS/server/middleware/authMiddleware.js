const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'User no longer exists in database. Please relogin.' });
            }
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

const roleCheck = (requiredPermission) => {
    return async (req, res, next) => {
        if (req.user.role === 'Super Admin') return next();
        
        try {
            const { Role } = require('../models');
            const userWithRole = await User.findByPk(req.user.id, {
                include: [{ model: Role }]
            });
            const perms = userWithRole?.Role?.permissions || [];
            if (perms.includes(requiredPermission)) return next();
            
            return res.status(403).json({ message: `Access denied. Missing ${requiredPermission} permission.` });
        } catch (err) {
            return res.status(500).json({ message: 'Role verification failed' });
        }
    };
};


module.exports = { protect, authorize, roleCheck };
