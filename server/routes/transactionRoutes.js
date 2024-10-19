const express = require('express');
const { getTransactions, addTransaction, deleteTransaction } = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', authMiddleware, getTransactions);
router.post('/add', authMiddleware, addTransaction);
router.post('/delete', authMiddleware, deleteTransaction);

module.exports = router;
