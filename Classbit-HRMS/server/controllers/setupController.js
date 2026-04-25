const { Setting, User, Role, Company, AppConfig, sequelize } = require('../models');
const setupTokenService = require('../utils/setupTokenService');

const getSetupStatus = async (req, res) => {
    try {
        // Check if admin exists
        const adminRole = await Role.findOne({ where: { name: 'Super Admin' } });
        let adminExists = false;
        if (adminRole) {
            const adminCount = await User.count({ where: { roleId: adminRole.id } });
            if (adminCount > 0) adminExists = true;
        }

        const configCheck = await AppConfig.findOne({ where: { key: 'isSetupComplete' } });
        let isSetupComplete = false;
        
        // Setup is only truly complete if both the config says so AND an admin actually exists
        if (configCheck && configCheck.value === 'true' && adminExists) {
            isSetupComplete = true;
        } else if (adminExists) {
            isSetupComplete = true; // Fallback
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

const completeSetup = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { companyName, address, contactNumber, name, email, password, setupToken } = req.body;

        let adminRole = await Role.findOne({ where: { name: 'Super Admin' }, transaction });
        let adminExists = false;
        if (adminRole) {
            const adminCount = await User.count({ where: { roleId: adminRole.id }, transaction });
            if (adminCount > 0) adminExists = true;
        }

        // Check if already completed AND admin exists
        const configCheck = await AppConfig.findOne({ where: { key: 'isSetupComplete' }, transaction });
        if (configCheck && configCheck.value === 'true' && adminExists) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Setup is already complete.' });
        }

        if (!setupToken) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Setup token is required.' });
        }

        // Validate token
        if (!setupTokenService.validateToken(setupToken)) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid setup token.' });
        }

        if (!adminRole) {
            adminRole = await Role.create({ 
                name: 'Super Admin', 
                description: 'Full system access' 
            }, { transaction });
        } else if (adminExists) {
            // Check if admin already exists
            await transaction.rollback();
            return res.status(400).json({ message: 'Setup is already complete. Admin exists.' });
        }

        // 1. Create Company
        let logoUrl = null;
        if (req.file) {
            logoUrl = req.file.filename;
        }

        await Company.create({
            name: companyName,
            address: address || null,
            contactNumber: contactNumber || null,
            logoUrl: logoUrl
        }, { transaction });

        // 2. Create the user
        const newAdmin = await User.create({
            email,
            password, // Hook automatically hashes it
            roleId: adminRole.id,
            isActive: true,
            needsPasswordChange: true // Follow the bonus instructions / existing model rule
        }, { transaction });

        // 3. Mark setup complete (upsert to handle if it was left over from a previous setup)
        const [appConfig, created] = await AppConfig.findOrCreate({
            where: { key: 'isSetupComplete' },
            defaults: { value: 'true' },
            transaction
        });
        
        if (!created) {
            await appConfig.update({ value: 'true' }, { transaction });
        }

        // IMPORTANT: Invalidate the token so it cannot be used again
        setupTokenService.invalidateToken();

        await transaction.commit();

        res.status(201).json({ 
            message: 'Setup completed successfully.',
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

const getCompany = async (req, res) => {
    try {
        const company = await Company.findOne();
        res.json(company || { name: 'Classbit Connect', logoUrl: null });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCompany = async (req, res) => {
    try {
        const company = await Company.findOne();
        if (company) {
            await company.update(req.body);
            res.json(company);
        } else {
            const newCompany = await Company.create(req.body);
            res.json(newCompany);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateSetting, getSettings, getSetupStatus, completeSetup, getCompany, updateCompany };
