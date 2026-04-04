const jwt = require('jsonwebtoken');
const { User, Role, Employee } = require('../models');
const { createLog } = require('./activityController');
const { sendOtpEmail } = require('../utils/emailService');

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

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

        if (user.needsPasswordChange) {
            return res.json({ requirePasswordChange: true, email: user.email });
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
                permissions: user.Role.permissions ? (typeof user.Role.permissions === 'string' ? JSON.parse(user.Role.permissions) : user.Role.permissions) : [],
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
        res.json({
            id: user.id,
            email: user.email,
            role: user.Role.name,
            permissions: user.Role.permissions ? (typeof user.Role.permissions === 'string' ? JSON.parse(user.Role.permissions) : user.Role.permissions) : [],
            employeeId: user.Employee ? user.Employee.id : null,
            departmentId: user.Employee ? user.Employee.departmentId : null,
            firstName: user.Employee ? user.Employee.firstName : 'Admin',
            lastName: user.Employee ? user.Employee.lastName : '',
            profilePicture: user.Employee ? user.Employee.profilePicture : null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const firstLoginChangePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).' });
        }

        user.password = newPassword;
        user.needsPasswordChange = false;
        await user.save();
        
        await createLog(user.id, 'PASSWORD_CHANGED', 'Auth', `User changed password upon first login`);

        res.json({ message: 'Password changed successfully. Please log in.' });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        const emailSent = await sendOtpEmail(email, otp);
        if (!emailSent) {
            return res.status(500).json({ message: 'Failed to send OTP email.' });
        }

        await createLog(user.id, 'OTP_REQUESTED', 'Auth', `OTP requested for password reset`);

        res.json({ message: 'OTP sent to your email address successfully. It is valid for 10 minutes.' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user || user.resetOtp !== otp || new Date() > user.resetOtpExpiry) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        if (!passwordRegex.test(newPassword)) {
           return res.status(400).json({ message: 'Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).' });
        }

        user.password = newPassword;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        user.needsPasswordChange = false;
        await user.save();
        
        await createLog(user.id, 'PASSWORD_RESET', 'Auth', `Password reset via self-service OTP`);

        res.json({ message: 'Password reset successfully' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (!passwordRegex.test(newPassword)) {
           return res.status(400).json({ message: 'Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).' });
        }

        user.password = newPassword;
        await user.save();
        
        await createLog(user.id, 'PASSWORD_CHANGED', 'Auth', `User changed their password natively`);

        res.json({ message: 'Password updated successfully' });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { login, getMe, firstLoginChangePassword, forgotPassword, resetPassword, changePassword };
