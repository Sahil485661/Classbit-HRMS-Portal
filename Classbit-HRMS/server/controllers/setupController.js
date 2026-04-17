const { Setting, User, Role, sequelize } = require('../models');
const setupTokenService = require('../utils/setupTokenService');

const getSetupStatus = async (req, res) => {
    try {
        const adminRole = await Role.findOne({ where: { name: 'Super Admin' } });
        
        let isSetupComplete = false;
        if (adminRole) {
            const adminCount = await User.count({ where: { roleId: adminRole.id } });
            if (adminCount > 0) isSetupComplete = true;
        }

        if (isSetupComplete) {
            return res.json({
                isSetupComplete: true,
                setupRequired: false,
                setupTokenRequired: false
            });
        }

        // If no admin exists, generate token (logs to console safely)
        setupTokenService.generateToken();

        res.json({
            isSetupComplete: false,
            setupRequired: true,
            setupTokenRequired: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking setup status', error: error.message });
    }
};

const createAdmin = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, password, setupToken } = req.body;

        if (!setupToken) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Setup token is required.' });
        }

        // Validate token
        if (!setupTokenService.validateToken(setupToken)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid setup token.' });
        }

        let adminRole = await Role.findOne({ where: { name: 'Super Admin' }, transaction });
        
        if (!adminRole) {
            adminRole = await Role.create({ 
                name: 'Super Admin', 
                description: 'Full system access' 
            }, { transaction });
        } else {
            // Check if admin already exists
            const adminCount = await User.count({ where: { roleId: adminRole.id }, transaction });
            if (adminCount > 0) {
                await transaction.rollback();
                return res.status(400).json({ message: 'Setup is already complete. Admin exists.' });
            }
        }

        // Create the user
        const newAdmin = await User.create({
            email,
            password, // Hook automatically hashes it
            roleId: adminRole.id,
            isActive: true,
            needsPasswordChange: true // Follow the bonus instructions / existing model rule
        }, { transaction });

        // IMPORTANT: Invalidate the token so it cannot be used again
        setupTokenService.invalidateToken();

        await transaction.commit();

        res.status(201).json({ 
            message: 'Super Admin created successfully.',
            user: { id: newAdmin.id, email: newAdmin.email }
        });
    } catch (error) {
        await transaction.rollback();
        res.status(500).json({ message: 'Failed to create admin.', error: error.message });
    }
};

const updateSetting = async (req, res) => {
    try {
        const { key, value, category } = req.body;
        const [setting, created] = await Setting.findOrCreate({
            where: { key },
            defaults: { value, category }
        });

        if (!created) {
            await setting.update({ value, category });
        }

        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSettings = async (req, res) => {
    try {
        const { category } = req.query;
        const where = category ? { category } : {};
        const settings = await Setting.findAll({ where });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateSetting, getSettings, getSetupStatus, createAdmin };
