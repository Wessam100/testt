const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: true},
  coverImage: {type: DataTypes.STRING, allowNull: true},
  audioFile: {type: DataTypes.STRING, allowNull: true},
  genre: {type: DataTypes.STRING, allowNull: true},
  authorId: {type: DataTypes.UUID, allowNull: false, references: {model: 'Users', key: 'id'}}, // make sure to revisit ALL THESE ALLOW NULLS BECAUSE I CHANGED A LOT TO ALLOW FOR THIS BASIC IMPLEMENTATION
  createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {
  timestamps: false
});

Book.associate = function(models) {
  Book.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
  Book.hasMany(models.Favorite, { foreignKey: 'bookId', as: 'favoritedBy' });
  //Book.hasMany(models.ReadingProgress, { foreignKey: 'bookId', as: 'readers' });
};

module.exports = Book; 