const http = require('http');
const { User, Role } = require('./models');

async function testPost() {
    const adminRole = await Role.findOne({ where: { name: 'Super Admin' } });
    if (!adminRole) { console.log('No admin role'); return; }
    
    const adminUser = await User.findOne({ where: { roleId: adminRole.id } });
    if (!adminUser) { console.log('No admin user'); return; }

    const jwt = require('jsonwebtoken');
    require('dotenv').config();
    const token = jwt.sign(
        { id: adminUser.id, role: 'Super Admin' },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    const data = JSON.stringify({
        title: "API Test",
        dateTime: new Date().toISOString().slice(0,16),
        agenda: "API testing",
        meetingLink: "https://zoom.us/test",
        targetAudience: { type: 'all', data: [] }
    });

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/meetings',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
            'Authorization': 'Bearer ' + token
        }
    };

    const req = http.request(options, res => {
        let body = '';
        res.on('data', d => { body += d; });
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            console.log('Response:', body);
        });
    });

    req.on('error', e => {
        console.error('Problem with request:', e.message);
    });

    req.write(data);
    req.end();
}

testPost();
