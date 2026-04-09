const RecentlyViewed = require('../models/RecentlyViewed');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Generates personalized recommendations based on user history
 * @param {string} userId - ID of the logged-in user
 * @returns {Array} List of recommended products
 */
const getPersonalizedRecommendations = async (userId) => {
    try {
        // 1. Get user's recently viewed products
        const history = await RecentlyViewed.find({ user: userId })
            .sort({ viewedAt: -1 })
            .limit(5)
            .populate('product');

        if (history.length === 0) {
            // Fallback: Trending/Top rated products
            return await Product.find().sort({ ratings: -1 }).limit(10);
        }

        // 2. Extract categories user is interested in
        const interestedCategories = history.map(h => h.product.category);

        // 3. Find products in same categories but not viewed yet
        const viewedProductIds = history.map(h => h.product._id);
        
        let recommendations = await Product.find({
            category: { $in: interestedCategories },
            _id: { $not: { $in: viewedProductIds } }
        }).limit(10);

        // 4. If AI logic is needed for "Smart" matching, we'd use aiMetadata.keywords here
        if (recommendations.length < 5) {
            const extra = await Product.find({ _id: { $nin: viewedProductIds } }).limit(5);
            recommendations = recommendations.concat(extra);
        }

        return recommendations;
    } catch (error) {
        console.error('Recommendation engine error:', error);
        return [];
    }
};

module.exports = {
    getPersonalizedRecommendations
};
