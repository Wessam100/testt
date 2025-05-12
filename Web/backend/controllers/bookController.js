const { Book, User } = require('../models');


const getAdminBookList = async (req, res) => {
    try { 
        const books = await Book.findAll({ attributes: ['id', 'title', 'genre', 'description'] });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getUserBooks = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const books = await Book.findAll({
            where: { authorId: user.id },
            attributes: ['id', 'title', 'coverImage', 'description']
        });

        res.json(books);
    } catch (error) {
        console.error('Error in getUserBooks:', error);
        res.status(500).json({ error: error.message });
    }
};

const getBookDetails = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error('Error in getBookDetails:', error);
        res.status(500).json({ error: error.message });
    }
};

const addAdminBook = async (req, res) => {
    try {
      console.log('Request body received in controller:', JSON.stringify(req.body));
      
      const { title, genre, authorId, description } = req.body;
      
  
      const coverImageFile = req.files['coverImage']?.[0];
      const audioFile = req.files['audioFile']?.[0];
      
      
      if (!coverImageFile || !audioFile) {
        return res.status(400).json({ error: 'Both image and audio files are required' });
      }
      
      if (!authorId) {
        console.log('ERROR: No authorId provided in request');
        return res.status(400).json({ error: 'Author ID is required' });
      }
      
      console.log('Creating book with authorId:', authorId);
      
      const book = await Book.create({
        title,
        genre,
        authorId: authorId,
        audioFile: `uploads/audio/${audioFile.filename}`,
        coverImage: `uploads/covers/${coverImageFile.filename}`,
        description: description
      });
      
      console.log('Book created successfully with ID:', book.id);
  
      res.status(201).json(book);
    } catch (error) {
      console.error('Error in addBook ', error);
      res.status(500).json({error});
    }
  };
  

const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findByPk(bookId);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        await book.destroy();
        res.status(204).send();
    } catch (error) {
        console.error('Error in deleteBook:', error);
        res.status(500).json({ error: error.message });
    }
}

const editBook = async (req, res) => {
  try {
    const { id, title, genre, description } = req.body;
    const book = await Book.findByPk(id);
    if (!book) return res.status(404).json({ error: 'book not found' });

    book.title = title;
    book.genre = genre;
    if (description !== undefined) {
      book.description = description;
    }
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// No UI currently so not using it 
// const updateBook = async (req, res) => { 
//     try {
//         const { bookId } = req.params;
//         const { title, genre, coverImage, audioFile } = req.body;

//         const book = await Book.findByPk(bookId);

//         if (!book) {
//             return res.status(404).json({ error: 'Book not found' });
//         }

//         await book.update({ title, genre, coverImage, audioFile });
//         res.status(200).json(book);
//     } catch (error) {
//         console.error('Error in updateBook:', error);
//         res.status(500).json({ error: error.message });
//     }
// };

const getBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const books = await Book.findAll({
            where: { genre },
            attributes: ['id', 'title', 'coverImage', 'description', 'genre'],
            include: [{
                model: User,
                as: 'author',
                attributes: ['username']
            }]
        });

        if (!books.length) {
            return res.status(404).json({ error: 'No books found' });
        }

        const formattedBooks = books.map(book => ({
            ...book.toJSON(),
            author: book.author.username,
            coverImage: book.coverImage ? `/${book.coverImage}` : null
        }));

        res.json(formattedBooks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getUserBooks,getBookDetails,addAdminBook, getAdminBookList, deleteBook, editBook, getBooksByGenre}; 