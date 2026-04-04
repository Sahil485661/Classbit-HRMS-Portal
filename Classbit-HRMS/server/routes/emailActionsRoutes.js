const express = require('express');
const router = express.Router();
const { notifyLoan, notifyLeave, notifyReimbursement } = require('../controllers/emailActionsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect); // Available to roles pushing approvals (HR, Manager, etc.) 

// Using POST as this triggers a generic action that constructs the state implicitly
router.post('/loan/:id/notify', notifyLoan);
router.post('/leave/:id/notify', notifyLeave);
router.post('/reimbursement/:id/notify', notifyReimbursement);

module.exports = router;
