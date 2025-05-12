const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PlaylistBook = sequelize.define('PlaylistBook', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  playlistId: {type: DataTypes.UUID, allowNull: false, references: {model: 'Playlists', key: 'id'}},
  bookId: {type: DataTypes.UUID, allowNull: false, references: {model: 'Books', key: 'id'}},
  order: {type: DataTypes.INTEGER, allowNull: true},
  addedAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW} 
}, {
  timestamps: false
});

module.exports = PlaylistBook; 