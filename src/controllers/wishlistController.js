const Wishlist = require('../models/Wishlist');
const catchAsync = require('../utils/catchAsync');

const getWishlist = catchAsync(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [] });
    }
    res.status(200).json({ success: true, data: wishlist });
});

const toggleWishlist = catchAsync(async (req, res) => {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
    } else {
        const index = wishlist.products.indexOf(productId);
        if (index > -1) {
            wishlist.products.splice(index, 1);
        } else {
            wishlist.products.push(productId);
        }
        await wishlist.save();
    }

    res.status(200).json({ success: true, data: wishlist });
});

module.exports = { getWishlist, toggleWishlist };
