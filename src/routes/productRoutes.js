const express = require('express');
const { getProducts } = require('../controllers/productController');
const { getProductReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
