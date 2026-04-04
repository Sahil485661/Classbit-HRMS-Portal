const { EmailTemplate, EmailLog } = require('../models');

exports.getTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.findAll({ order: [['name', 'ASC']] });
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Server error fetching templates' });
    }
};

exports.updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { subject, htmlBody } = req.body;
        
        const template = await EmailTemplate.findByPk(id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        template.subject = subject;
        template.htmlBody = htmlBody;
        await template.save();

        res.json({ message: 'Template updated successfully', template });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ message: 'Server error updating template' });
    }
};

exports.getLogs = async (req, res) => {
    try {
        const logs = await EmailLog.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100 // Only fetch the last 100 logs for UI safety
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching email logs:', error);
        res.status(500).json({ message: 'Server error fetching logs' });
    }
};
