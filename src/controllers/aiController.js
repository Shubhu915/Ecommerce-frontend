const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { parseSearchQuery } = require('../services/aiService');

/**
 * @desc    AI Assistant for conversational shopping
 * @route   POST /api/v1/ai/assistant
 * @access  Public
 */
const shoppingAssistant = catchAsync(async (req, res) => {
    const { message } = req.body;

    if (!message) {
        throw new ApiError(400, 'Message is required');
    }

    // 1. Parse intent using the existing AI search logic
    const aiFilters = await parseSearchQuery(message);

    let products = [];
    let reply = "I couldn't find exactly what you're looking for, but here are some popular items!";

    if (aiFilters) {
        // Build Mongoose query
        const queryObj = {};
        if (aiFilters.name) queryObj.name = { $regex: aiFilters.name, $options: 'i' };
        if (aiFilters.maxPrice) queryObj.price = { $lte: aiFilters.maxPrice };
        if (aiFilters.category) queryObj['aiMetadata.keywords'] = { $in: [aiFilters.category] };

        products = await Product.find(queryObj).limit(3);
        
        if (products.length > 0) {
            reply = `I found ${products.length} great options for you! The ${products[0].name} seems like a perfect match.`;
        }
    } else {
        products = await Product.find().limit(3);
    }

    res.status(200).json({
        success: true,
        reply,
        suggestedProducts: products,
        intent: aiFilters ? 'search' : 'general'
    });
});

/**
 * @desc    AI Review Summary
 * @route   GET /api/v1/products/:id/ai-summary
 * @access  Public
 */
const getReviewSummary = catchAsync(async (req, res) => {
    const reviews = await Review.find({ product: req.params.id });

    if (reviews.length === 0) {
        return res.status(200).json({
            success: true,
            summary: "No reviews yet. Be the first to review!",
            sentimentScore: 5,
            pros: [],
            cons: []
        });
    }

    // Mock AI analysis (In production, you'd send review text to OpenAI)
    const summary = `Based on ${reviews.length} reviews, customers generally find this product high quality and reliable.`;
    
    res.status(200).json({
        success: true,
        summary,
        sentimentScore: 4.2,
        pros: ["Quality", "Fast Shipping"],
        cons: ["Packaging could be better"]
    });
});

/**
 * @desc    AI Visual Search
 * @route   POST /api/v1/ai/visual-search
 * @access  Public
 */
const visualSearch = catchAsync(async (req, res) => {
    // This requires vision models (like GPT-4o or Clip). 
    // We'll mock the response structure as requested.
    const products = await Product.find().limit(3);
    
    const results = products.map(p => ({
        productId: p._id,
        matchScore: (Math.random() * (0.99 - 0.85) + 0.85).toFixed(2),
        productDetails: p
    }));

    res.status(200).json({
        success: true,
        data: results
    });
});

module.exports = {
    shoppingAssistant,
    getReviewSummary,
    visualSearch
};
