const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanIndexes() {
    console.log("Connecting to DB...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'classbit_hrms'
    });

    console.log("Connected.");
    
    const [tables] = await connection.query("SHOW TABLES");
    const tableKey = Object.keys(tables[0])[0];
    
    for (let t of tables) {
        const tableName = t[tableKey];
        
        try {
            const [indexes] = await connection.query(`SHOW INDEX FROM \`${tableName}\``);
            
            // Map keys
            const keysByName = {};
            for (let idx of indexes) {
                if (idx.Key_name === 'PRIMARY') continue;
                if (!keysByName[idx.Key_name]) {
                    keysByName[idx.Key_name] = { name: idx.Key_name, cols: [] };
                }
                keysByName[idx.Key_name].cols.push(idx.Column_name);
            }
            
            // Map by column signature
            const keysBySignature = {};
            for (let k of Object.values(keysByName)) {
                const sig = k.cols.join(',');
                if (!keysBySignature[sig]) keysBySignature[sig] = [];
                keysBySignature[sig].push(k.name);
            }
            
            for (const [sig, keys] of Object.entries(keysBySignature)) {
                if (keys.length > 1) {
                    console.log(`Table ${tableName} has duplicate indexes for columns (${sig}): ${keys.join(', ')}`);
                    
                    // Keep the first one, drop the rest
                    for (let i = 1; i < keys.length; i++) {
                        const keyToDrop = keys[i];
                        console.log(`Dropping index ${keyToDrop} on ${tableName}...`);
                        try {
                            await connection.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`${keyToDrop}\``);
                        } catch (err) {
                            console.error(`Failed to drop ${keyToDrop}:`, err.message);
                        }
                    }
                }
            }
        } catch (e) {
            console.error(`Could not read indexes for ${tableName}:`, e.message);
        }
    }
    
    console.log("Done.");
    await connection.end();
}

cleanIndexes().catch(console.error);
