const { sequelize } = require('./config/db');
const models = require('./models');

async function debug() {
    try {
        const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
        console.log('Tables from information_schema:', results.map(r => r.table_name));
        
        for (const modelName of Object.keys(sequelize.models)) {
            const model = sequelize.models[modelName];
            try {
                const count = await model.count();
                console.log(`Model ${modelName} (table ${model.tableName}) has ${count} rows.`);
            } catch (e) {
                console.log(`Model ${modelName} (table ${model.tableName}) FAILED: ${e.message}`);
            }
        }
    } catch (err) {
        console.error(err);
    }
    process.exit(0);
}
debug();
