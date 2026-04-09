const Cart = require('../models/Cart');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const getCart = catchAsync(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, data: cart });
});

const addToCart = catchAsync(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
        cart = await Cart.create({ user: req.user.id, items: [{ product: productId, quantity }] });
    } else {
        const itemIndex = cart.items.findIndex(p => p.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
    }

    res.status(200).json({ success: true, data: cart });
});

module.exports = { getCart, addToCart };
