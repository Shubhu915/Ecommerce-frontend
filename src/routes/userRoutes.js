const express = require('express');
const { 
    trackView, 
    getUserRecommendations, 
    addAddress, 
    getAddresses, 
    toggleWishlist,
    updateProfile,
    changePassword 
} = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.use(protect); // All user routes protected

router.post('/track-view/:productId', trackView);
router.get('/recommendations', getUserRecommendations);

// Profile
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Address management
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);

// Wishlist toggle
router.post('/wishlist/toggle/:productId', toggleWishlist);

module.exports = router;
