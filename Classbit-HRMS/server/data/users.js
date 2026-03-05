const bcrypt = require('bcryptjs');

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123', // Will be hashed by model pre-save if using .create, but insertMany might bypass middleware? No, insertMany bypasses hooks!
        // So I need to hash manually here or use .create in seeder
        isAdmin: true,
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        isAdmin: false,
    },
];

module.exports = users;
