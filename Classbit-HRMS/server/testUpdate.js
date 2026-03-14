async function test() {
    try {
        // Login as Super Admin to get token
        const loginRes = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@classbit.com', password: 'admin' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login success');

        // Fetch tasks
        const tasksRes = await fetch('http://localhost:5000/api/tasks/my', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tasks = await tasksRes.json();
        
        if (tasks.length === 0) {
            console.log('No tasks found');
            return;
        }

        const task = tasks[0];
        console.log('Task to edit:', task.id, task.title);

        // Edit task
        const payload = {
            title: task.title + ' (edited)',
            description: task.description,
            deadline: task.deadline,
            priority: task.priority,
            assignmentType: 'Single Employee',
            assigneeIds: [task.TaskAssignments && task.TaskAssignments[0] ? task.TaskAssignments[0].employeeId : undefined].filter(Boolean),
            departmentId: ''
        };

        if (payload.assigneeIds.length === 0) {
            console.log('No assignees found to re-use, fetching an employee...');
            const empRes = await fetch('http://localhost:5000/api/employees', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const emps = await empRes.json();
            payload.assigneeIds = [emps[0].id];
        }

        console.log('Sending payload:', payload);

        const updateRes = await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(payload)
        });

        const updateData = await updateRes.json();
        if (!updateRes.ok) {
            console.log('Update failed with status:', updateRes.status);
            console.log('Data:', updateData);
        } else {
            console.log('Update success:', updateData.title);
        }
    } catch (err) {
        console.log('Update exception!');
        console.log(err.message);
    }
}

test();
