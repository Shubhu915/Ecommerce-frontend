const express = require('express');
const { addOrderItems, getOrderById } = require('../controllers/orderController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.post('/', addOrderItems);
router.get('/:id', getOrderById);

module.exports = router;
