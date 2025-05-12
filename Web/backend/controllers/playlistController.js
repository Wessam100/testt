const { Playlist, User, Book, PlaylistBook } = require('../models');

const getUserPlaylists = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ where: { username } });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const playlists = await Playlist.findAll({
            where: { userId: user.id },
            attributes: ['id', 'name', 'description', 'coverImage', 'isPublic']
        });

        res.json(playlists);
    } catch (error) {
        console.error('Error in getUserPlaylists:', error);
        res.status(500).json({ error: error.message });
    }
};

const getPlaylistDetails = async (req, res) => {
    try {
        const { playlistId } = req.params;
        const playlist = await Playlist.findByPk(playlistId, {
            include: [{
                model: Book,
                through: {
                    model: PlaylistBook,
                    attributes: ['order']
                }
            }]
        });

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        res.json(playlist);
    } catch (error) {
        console.error('Error in getPlaylistDetails:', error);
        res.status(500).json({ error: error.message });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const { username } = req.params;
        const { name, description, coverImage, isPublic } = req.body;

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const playlist = await Playlist.create({
            name,
            description,
            coverImage,
            isPublic,
            userId: user.id
        });

        res.status(201).json(playlist);
    } catch (error) {
        console.error('Error in createPlaylist:', error);
        res.status(500).json({ error: error.message });
    }
};

const addBookToPlaylist = async (req, res) => {
    try {
        const { playlistId, bookId } = req.params;
        const { order } = req.body;

        const [playlist, book] = await Promise.all([
            Playlist.findByPk(playlistId),
            Book.findByPk(bookId)
        ]);

        if (!playlist || !book) {
            return res.status(404).json({ error: 'Playlist or Book not found' });
        }

        await PlaylistBook.create({
            playlistId,
            bookId,
            order
        });

        res.status(201).json({ message: 'Book added to playlist' });
    } catch (error) {
        console.error('Error in addBookToPlaylist:', error);
        res.status(500).json({ error: error.message });
    }
};

const removeBookFromPlaylist = async (req, res) => {
    try {
        const { playlistId, bookId } = req.params;

        await PlaylistBook.destroy({
            where: {
                playlistId,
                bookId
            }
        });

        res.status(200).json({ message: 'Book removed from playlist' });
    } catch (error) {
        console.error('Error in removeBookFromPlaylist:', error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {getUserPlaylists,getPlaylistDetails,createPlaylist,addBookToPlaylist,removeBookFromPlaylist}; 