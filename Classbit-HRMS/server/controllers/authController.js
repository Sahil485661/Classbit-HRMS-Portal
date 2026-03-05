const jwt = require('jsonwebtoken');
const { User, Role, Employee } = require('../models');
const { createLog } = require('./activityController');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email },
            include: [Role, Employee]
        });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.Role.name,
                employeeId: user.Employee ? user.Employee.id : null,
                departmentId: user.Employee ? user.Employee.departmentId : null
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Create log
        await createLog(user.id, 'USER_LOGIN', 'Auth', `User ${user.email} logged in from ${req.ip}`);

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.Role.name,
                employeeId: user.Employee ? user.Employee.id : null,
                departmentId: user.Employee ? user.Employee.departmentId : null,
                firstName: user.Employee ? user.Employee.firstName : 'Admin',
                lastName: user.Employee ? user.Employee.lastName : '',
                profilePicture: user.Employee ? user.Employee.profilePicture : null
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [Role, Employee]
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, getMe };
