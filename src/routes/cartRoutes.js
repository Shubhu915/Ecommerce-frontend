const express = require('express');
const { getCart, addToCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);

module.exports = router;
