const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Playlist = sequelize.define('Playlist', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  name: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: true},
  coverImage: {type: DataTypes.STRING, allowNull: true},
  isPublic: {type: DataTypes.BOOLEAN, defaultValue: true},
  userId: {type: DataTypes.UUID, allowNull: false, references: {model: 'Users', key: 'id'}},
  createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {
  timestamps: false 
});

Playlist.associate = function(models) {
  Playlist.belongsTo(models.User, { foreignKey: 'userId', as: 'owner' });
  Playlist.belongsToMany(models.Book, { through: models.PlaylistBook, foreignKey: 'playlistId' });
};

module.exports = Playlist; 