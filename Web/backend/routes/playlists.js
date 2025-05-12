const express = require('express');
const router = express.Router();
const {
    getUserPlaylists,
    getPlaylistDetails,
    createPlaylist,
    addBookToPlaylist,
    removeBookFromPlaylist
} = require('../controllers/playlistController');

router.get('/user/:username', getUserPlaylists);

router.get('/details/:playlistId', getPlaylistDetails);

router.post('/user/:username', createPlaylist);

router.post('/:playlistId/books/:bookId', addBookToPlaylist);
router.delete('/:playlistId/books/:bookId', removeBookFromPlaylist);

module.exports = router; 