const Review = require('../models/Review');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get all reviews for a product
 * @route   GET /api/v1/products/:id/reviews
 * @access  Public
 */
const getProductReviews = catchAsync(async (req, res) => {
    const reviews = await Review.find({ product: req.params.id }).populate('user', 'name avatar');
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
});

/**
 * @desc    Create a review
 * @route   POST /api/v1/products/:id/reviews
 * @access  Private
 */
const createReview = catchAsync(async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) throw new ApiError(404, 'Product not found');

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({ user: req.user.id, product: productId });
    if (alreadyReviewed) throw new ApiError(400, 'Product already reviewed');

    const review = await Review.create({
        user: req.user.id,
        product: productId,
        name: req.user.name,
        rating: Number(rating),
        comment
    });

    // Update product average rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ success: true, message: 'Review added', data: review });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/v1/reviews/:id
 * @access  Private/Owner
 */
const deleteReview = catchAsync(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) throw new ApiError(404, 'Review not found');

    // Check ownership
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        throw new ApiError(401, 'Not authorized');
    }

    await review.deleteOne();

    // Recalculate product rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.numReviews = reviews.length;
    product.ratings = reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;

    await product.save();

    res.status(200).json({ success: true, message: 'Review removed' });
});

module.exports = {
    getProductReviews,
    createReview,
    deleteReview
};
