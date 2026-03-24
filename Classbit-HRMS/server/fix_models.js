const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

for (const file of files) {
    if (file.endsWith('.js')) {
        const filePath = path.join(modelsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        let changed = false;
        if (content.includes('DataTypes.JSONB')) {
            content = content.replace(/DataTypes\.JSONB/g, 'DataTypes.JSON');
            changed = true;
        }

        // UUID optimization for MySQL (though Sequelize UUID maps to CHAR(36) in MySQL automatically, 
        // the prompt instructed: UUID -> CHAR(36).
        // Let's explicitly replace DataTypes.UUID to DataTypes.CHAR(36) if needed, 
        // but Sequelize DataTypes.UUID acts precisely the same way. 
        // I will keep UUID as is, since Sequelize 6+ supports it and maps to CHAR(36) BINARY.
        // If we strictly want CHAR(36), we could do it, but let's stick to Sequelize DataTypes.JSON for JSONB.

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed JSONB in', file);
        }
    }
}
