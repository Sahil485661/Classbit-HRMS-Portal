const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function test() {
    try {
        // Create a valid token for an existing employee
        // From check_db.js: id: '16', employeeId: '79087ec4-c041-4324-8aeb-fe8fb53db2a1'
        // We need the USER ID for the token, not the employee ID.
        // Let's find a user who is an employee.
        
        const payload = {
            id: '425bc091-6a52-4b73-974a-15bc77e91149',
            role: 'Employee',
            employeeId: '79087ec4-c041-4324-8aeb-fe8fb53db2a1'
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        console.log('Using token:', token);

        console.log('Sending status update request...');
        try {
            const res = await axios.post('http://localhost:5000/api/attendance/update-status', 
                { type: 'Tea Break' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('SUCCESS:', res.data);
        } catch (err) {
            console.log('REQUEST FAILED');
            if (err.response) {
                console.log('Status:', err.response.status);
                console.log('Data:', err.response.data);
            } else {
                console.log('Error Message:', err.message);
            }
        }
    } catch (error) {
        console.error('Test script error:', error);
    }
}

test();
