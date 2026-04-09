const Order = require('../models/Order');
const Product = require('../models/Product');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Create new order
 * @route   POST /api/v1/orders
 * @access  Private
 */
const addOrderItems = catchAsync(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        throw new ApiError(400, 'No order items');
    }

    // Verify stock and prices for each item
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new ApiError(404, `Product not found: ${item.product}`);
        }
        if (product.stock < item.qty) {
            throw new ApiError(400, `Insufficient stock for ${product.name}`);
        }
        // Deduct stock
        product.stock -= item.qty;
        await product.save();
    }

    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json({
        success: true,
        data: createdOrder
    });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
const getOrderById = catchAsync(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        throw new ApiError(404, 'Order not found');
    }

    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, 'Not authorized to view this order');
    }

    res.status(200).json({ success: true, data: order });
});

module.exports = {
    addOrderItems,
    getOrderById
};
