const Review = require('../models/review');
const Book = require('../models/book');

const addReview = async (req, res) => {
  console.log('reached add review controller with req body: ', req.body);
  try {
    const { user, book, message, rating } = req.body;
    if (!user || !book || !message || rating == null) {
      console.log('inputs', { user, book, message });
      return res.status(400).json({ error: 'Missing fields' });
    }
    const existingReview = await Review.findOne({
      where: { userId: user,bookId: book}
    });

    if (existingReview) {
      return res.status(400).json({ 
        error: 'already reviewed',
        existingReview 
      });
    }

    const review = await Review.create({
      userId: user,
      bookId: book,
      content: message,
      rating: rating
    });

    console.log('Review created successfully');
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'one review per user lw sama7t' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getReviewsForBook = async (req, res) => {
  const bookId = req.params.id;
  console.log('reviews controller: received comments request. Fetching comments now for bookid:', bookId);
  try {
    if (!bookId) {
      console.log('error 400: no book id provided');
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const reviews = await Review.findAll({
      where: { bookId },
      order: [['createdAt', 'DESC']]
    });

    console.log('Successfully fetched reviews');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Controller: error in getReviewsForBook:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addReview, getReviewsForBook };

