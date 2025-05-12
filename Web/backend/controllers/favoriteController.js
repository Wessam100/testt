const { Favorite, User, Book } = require('../models');

const getUserFavorites = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ 
            where: { username: username },
            attributes: ['id']
        });
        console.log('user', user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const favorites = await Favorite.findAll({
            where: { userId: user.id },
            include: [{
                model: Book,
                as: 'book',
                attributes: ['id']
            }]
        });

        const bookIds = favorites.map(f => f.book.id);
        const books = await Book.findAll({
            where: { id: bookIds },
            attributes: ['id', 'title', 'coverImage', 'authorId'],
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });

        // Format the response
        const formattedBooks = books.map(book => ({
            id: book.id,
            title: book.title,
            coverImage: book.coverImage,
            authorName: book.author.username
        }));

        res.json(formattedBooks);
    } catch (error) {
        console.error('Error in getUserFavorites :(((', error);
        res.status(500).json({ error: error.message });
    }
};

const isFavorited = async (req, res) => {
    try {
        const { userId, bookId } = req.params;
        const user = await User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const favorite = await Favorite.findOne({
            where: { userId, bookId }
        });
        if(favorite){
            res.status(200).json({ isFavorited: true });
        }else{
            res.status(200).json({ isFavorited: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleFavorite = async (req, res) => { // since the logic is trivial we could technically group it into once, i am referring to adding or removing a favorited book.
    try {
        const { userId, bookId } = req.params;
        
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const book = await Book.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const existingFavorite = await Favorite.findOne({
            where: { userId, bookId }
        });

        if (existingFavorite) {
            await existingFavorite.destroy();
            return res.status(200).json({ message: 'Book removed from favorites', isFavorited: false });
        } else {
            await Favorite.create({
                userId,
                bookId
            });
            return res.status(200).json({ message: 'Book added to favorites', isFavorited: true });
        }
    } catch (error) {
        console.error('Error in toggleFavorite:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getUserFavorites,
    toggleFavorite,
    isFavorited
}; 