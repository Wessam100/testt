const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  userId: {type: DataTypes.UUID, allowNull: false, primaryKey: true},
  bookId: { type: DataTypes.UUID, allowNull: false, primaryKey: true},
  rating: { type: DataTypes.INTEGER,  allowNull: false, validate: { min: 1, max: 5 } },
  content: { type: DataTypes.TEXT, allowNull: false }}, {
  timestamps: true
});

Review.associate = function(models) {
  Review.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id' });
  Review.belongsTo(models.Book, { foreignKey: 'bookId', targetKey: 'id' });
};

module.exports = Review; 