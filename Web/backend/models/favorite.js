const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  userId: {type: DataTypes.UUID, allowNull: false, references: {model: 'Users', key: 'id'}, primaryKey: true},
  bookId: {type: DataTypes.STRING, allowNull: false, references: {model: 'Books', key: 'id'}, primaryKey: true},
  createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
}, {
  timestamps: false
});

Favorite.associate = function(models) {
  Favorite.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  Favorite.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
};

module.exports = Favorite; 