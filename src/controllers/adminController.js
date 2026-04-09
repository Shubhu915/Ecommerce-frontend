const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/v1/admin/stats
 * @access  Private/Admin
 */
const getStats = catchAsync(async (req, res) => {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    const salesData = await Order.aggregate([
        { $match: { isPaid: true } },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' }
            }
        }
    ]);

    const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);

    res.status(200).json({
        success: true,
        data: {
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue: salesData[0] ? salesData[0].totalRevenue : 0,
            lowStockProducts
        }
    });
});

/**
 * @desc    Update order status
 * @route   PUT /api/v1/admin/orders/:id/status
 * @access  Private/Admin
 */
const updateOrderStatus = catchAsync(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    order.status = status;
    if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
    }

    await order.save();
    res.status(200).json({ success: true, data: order });
});

/**
 * @desc    Create a product
 * @route   POST /api/v1/admin/products
 * @access  Private/Admin
 */
const createProduct = catchAsync(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
});

/**
 * @desc    Update a product
 * @route   PUT /api/v1/admin/products/:id
 * @access  Private/Admin
 */
const updateProduct = catchAsync(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: product });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/admin/products/:id
 * @access  Private/Admin
 */
const deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) throw new ApiError(404, 'Product not found');

    await product.deleteOne();
    res.status(200).json({ success: true, message: 'Product deleted' });
});

/**
 * @desc    Get Revenue Analytics
 * @route   GET /api/v1/admin/analytics/revenue
 */
const getRevenueAnalytics = catchAsync(async (req, res) => {
    const { period = 'monthly' } = req.query;
    
    // Aggregation logic for revenue time series
    const revenue = await Order.aggregate([
        { $match: { isPaid: true } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$totalPrice" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, data: revenue });
});

/**
 * @desc    Get Top Selling Products
 * @route   GET /api/v1/admin/analytics/top-products
 */
const getTopProducts = catchAsync(async (req, res) => {
    // This would typically involve Order aggregation
    const products = await Product.find().sort({ ratings: -1 }).limit(5);
    res.status(200).json({ success: true, data: products });
});

/**
 * @desc    Bulk Upload Products
 * @route   POST /api/v1/admin/products/bulk-upload
 */
const bulkUploadProducts = catchAsync(async (req, res) => {
    const products = req.body;
    if (!Array.isArray(products)) throw new ApiError(400, 'Body must be an array of products');

    const inserted = await Product.insertMany(products);
    res.status(201).json({ success: true, count: inserted.length, message: 'Bulk upload successful' });
});

module.exports = {
    getStats,
    updateOrderStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    getRevenueAnalytics,
    getTopProducts,
    bulkUploadProducts
};
