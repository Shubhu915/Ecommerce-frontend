const User = require('../models/User');
const Wishlist = require('../models/Wishlist');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const RecentlyViewed = require('../models/RecentlyViewed');
const { getPersonalizedRecommendations } = require('../services/recommendationService');

/**
 * @desc    Get personalized product recommendations
 * @route   GET /api/v1/user/recommendations
 * @access  Private
 */
const getUserRecommendations = catchAsync(async (req, res) => {
    const recommendations = await getPersonalizedRecommendations(req.user._id);

    res.status(200).json({
        success: true,
        count: recommendations.length,
        data: recommendations
    });
});

/**
 * @desc    Log product view for AI suggestions
 * @route   POST /api/v1/user/track-view/:productId
 * @access  Private
 */
const trackView = catchAsync(async (req, res) => {
    const { productId } = req.params;

    await RecentlyViewed.deleteOne({ user: req.user._id, product: productId });
    await RecentlyViewed.create({ user: req.user._id, product: productId });

    res.status(200).json({ success: true });
});

/**
 * @desc    Add/Remove address
 * @route   POST /api/v1/user/addresses
 * @access  Private
 */
const addAddress = catchAsync(async (req, res) => {
    const { street, city, state, zipCode, country, isDefault } = req.body;
    const user = await User.findById(req.user.id);

    if (isDefault) {
        user.addresses.forEach(addr => addr.isDefault = false);
    }

    user.addresses.push({ street, city, state, zipCode, country, isDefault });
    await user.save();

    res.status(200).json({ success: true, data: user.addresses });
});

const getAddresses = catchAsync(async (req, res) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user.addresses });
});

/**
 * @desc    Toggle wishlist item
 * @route   POST /api/v1/user/wishlist/toggle/:productId
 * @access  Private
 */
const toggleWishlist = catchAsync(async (req, res) => {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = await Wishlist.create({ user: req.user._id, products: [req.params.productId] });
    } else {
        const index = wishlist.products.indexOf(req.params.productId);
        if (index > -1) {
            wishlist.products.splice(index, 1);
        } else {
            wishlist.products.push(req.params.productId);
        }
        await wishlist.save();
    }

    res.status(200).json({ success: true, data: wishlist });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/user/profile
 * @access  Private
 */
const updateProfile = catchAsync(async (req, res) => {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, avatar }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: user });
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/user/change-password
 * @access  Private
 */
const changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user || !(await user.matchPassword(currentPassword))) {
        throw new ApiError(401, 'Invalid current password');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
});

module.exports = {
    getUserRecommendations,
    trackView,
    addAddress,
    getAddresses,
    toggleWishlist,
    updateProfile,
    changePassword
};
