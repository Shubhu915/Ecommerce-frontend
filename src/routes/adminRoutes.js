const express = require('express');
const { 
    getStats, 
    updateOrderStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    getRevenueAnalytics,
    getTopProducts,
    bulkUploadProducts
} = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply protection and admin authorization to all admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.put('/orders/:id/status', updateOrderStatus);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/top-products', getTopProducts);

// Product Management
router.post('/products', createProduct);
router.post('/products/bulk-upload', bulkUploadProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
