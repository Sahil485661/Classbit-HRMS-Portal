const { Employee, User, Role, Department } = require('../models');

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({
            include: [
                { model: User, attributes: ['email', 'isActive', 'lastLogin'], include: [Role] },
                { model: Department }
            ]
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['email', 'isActive', 'lastLogin'], include: [Role] },
                { model: Department }
            ]
        });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEmployee = async (req, res) => {
    try {
        const {
            email, password, roleId,
            employeeId, firstName, lastName, gender,
            joiningDate, departmentId, designation, status
        } = req.body;

        // Create User first
        const user = await User.create({
            email,
            password,
            roleId
        });

        // Create Employee record
        const employee = await Employee.create({
            userId: user.id,
            employeeId,
            firstName,
            lastName,
            gender,
            joiningDate,
            departmentId,
            designation,
            status
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { email, password, roleId, ...employeeData } = req.body;
        const employee = await Employee.findByPk(req.params.id, { include: [User] });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Update Employee
        await employee.update(employeeData);

        // Update User if related fields provided
        if (email || password || roleId) {
            const user = await User.findByPk(employee.userId);
            if (user) {
                if (email) user.email = email;
                if (roleId) user.roleId = roleId;
                if (password) user.password = password; // Hook handles hashing
                await user.save();
            }
        }

        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        // Soft delete / Deactivate
        employee.status = 'Inactive';
        await employee.save();

        const user = await User.findByPk(employee.userId);
        user.isActive = false;
        await user.save();

        res.json({ message: 'Employee deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDepartments = async (req, res) => {
    try {
        const depts = await Department.findAll();
        res.json(depts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createDepartment = async (req, res) => {
    try {
        const dept = await Department.create(req.body);
        res.status(201).json(dept);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const reactivateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        employee.status = 'Active';
        await employee.save();

        const user = await User.findByPk(employee.userId);
        if (user) {
            user.isActive = true;
            await user.save();
        }

        res.json({ message: 'Employee reactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getRoles,
    createRole,
    getDepartments,
    createDepartment,
    reactivateEmployee
};
