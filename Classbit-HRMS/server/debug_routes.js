const express = require('express');
const debugApp = express();

try {
    debugApp.use('/api/attendance', require('./routes/attendanceRoutes'));

    console.log('--- REGISTERED ROUTES ---');
    debugApp._router.stack.forEach(layer => {
        if (layer.route) {
            console.log(`${Object.keys(layer.route.methods).join(',').toUpperCase()} ${layer.route.path}`);
        } else if (layer.name === 'router') {
            const prefix = layer.regexp.source
                .replace('\\/?', '')
                .replace('(?=\\/|$)', '')
                .replace('^\\/', '');
            
            layer.handle.stack.forEach(subLayer => {
                if (subLayer.route) {
                    const methods = Object.keys(subLayer.route.methods).join(',').toUpperCase();
                    console.log(`${methods} /${prefix}${subLayer.route.path}`);
                }
            });
        }
    });
} catch (err) {
    console.error('Error loading routes:', err);
}
