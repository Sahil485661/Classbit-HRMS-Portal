const { Setting } = require('../models');

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

module.exports = { updateSetting, getSettings };
