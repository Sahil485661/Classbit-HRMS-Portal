const { sequelize } = require('./models');

async function analyzeSchema() {
    try {
        const schema = {};
        for (const modelName in sequelize.models) {
            const model = sequelize.models[modelName];
            schema[modelName] = {
                tableName: model.tableName,
                attributes: {}
            };
            const attributes = model.rawAttributes;
            for (const attrName in attributes) {
                const attr = attributes[attrName];
                schema[modelName].attributes[attrName] = {
                    type: attr.type.key || attr.type.constructor.name,
                    allowNull: attr.allowNull,
                    primaryKey: attr.primaryKey,
                    defaultValue: typeof attr.defaultValue === 'function' ? 'function' : attr.defaultValue,
                    references: attr.references ? attr.references.model : null
                };
            }
        }
        
        require('fs').writeFileSync('schema_analysis.json', JSON.stringify(schema, null, 2));
        console.log('Schema analysis saved to schema_analysis.json');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

analyzeSchema();
