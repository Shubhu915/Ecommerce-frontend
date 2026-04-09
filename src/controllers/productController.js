const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const { parseSearchQuery } = require('../services/aiService');

/**
 * @desc    Get all products (with filters, AI search, pagination)
 * @route   GET /api/v1/products
 * @access  Public
 */
const getProducts = catchAsync(async (req, res) => {
    let queryObj = {};
    const { q, category, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

    // 1. AI or Standard Search
    if (q) {
        const aiFilters = await parseSearchQuery(q);
        if (aiFilters) {
            if (aiFilters.name) queryObj.name = { $regex: aiFilters.name, $options: 'i' };
            if (aiFilters.maxPrice) queryObj.price = { ...queryObj.price, $lte: aiFilters.maxPrice };
            if (aiFilters.category) queryObj['aiMetadata.keywords'] = { $in: [aiFilters.category] };
        } else {
            queryObj.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }
    }

    // 2. Direct Filters
    if (category) queryObj.category = category;
    if (minPrice || maxPrice) {
        queryObj.price = { ...queryObj.price };
        if (minPrice) queryObj.price.$gte = Number(minPrice);
        if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // 3. Sorting logic
    let query = Product.find(queryObj);
    if (sort) {
        const sortBy = sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // 4. Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(queryObj);
    query = query.skip(skip).limit(limitNum).populate('category', 'name');

    const products = await query;

    res.status(200).json({
        success: true,
        count: products.length,
        meta: {
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total
        },
        data: products
    });
});

module.exports = {
    getProducts
};
