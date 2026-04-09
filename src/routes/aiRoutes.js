const express = require('express');
const { shoppingAssistant, getReviewSummary, visualSearch } = require('../controllers/aiController');

const router = express.Router();

router.post('/assistant', shoppingAssistant);
router.get('/visual-search', visualSearch); // POST in docs, but GET placeholder for now if no file upload
router.post('/visual-search', visualSearch); 
router.get('/product/:id/summary', getReviewSummary);

module.exports = router;
