const express = require('express');
const router = express.Router();
const { addReview, getReviewsForBook } = require('../controllers/reviewController');

router.get('/:id', getReviewsForBook);
router.post('/add', addReview)

module.exports = router; 