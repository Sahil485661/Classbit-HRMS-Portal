async function testDashboard() {
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@classbit.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful');

        const statsRes = await fetch('http://localhost:5000/api/dashboard/stats', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const statsData = await statsRes.json();
        console.log('Stats:', JSON.stringify(statsData, null, 2));

        const tasksRes = await fetch('http://localhost:5000/api/tasks/my', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const tasksData = await tasksRes.json();
        console.log('Tasks Count:', tasksData.length);
        if (tasksData.length > 0) {
            console.log('First Task:', JSON.stringify(tasksData[0], null, 2));
        }

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testDashboard();
