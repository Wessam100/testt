const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReadingProgress = sequelize.define('ReadingProgress', {
  id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true},
  userId: {type: DataTypes.UUID, allowNull: false},
  bookId: {type: DataTypes.UUID, allowNull: false},
  currentTime: {type: DataTypes.INTEGER, allowNull: true}, // Current position in seconds
}, {
  timestamps: false // We'll manage timestamps manually if we ever need to
});

ReadingProgress.associate = function(models) {
   ReadingProgress.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
//   ReadingProgress.belongsTo(models.Book, { foreignKey: 'bookId', as: 'book' });
};

module.exports = ReadingProgress; 