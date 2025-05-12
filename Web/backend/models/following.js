const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Following = sequelize.define('Following', {
  followerId: {type: DataTypes.UUID, primaryKey: true ,allowNull: false, references: {model: 'Users', key: 'id'}},
  followedId: {type: DataTypes.UUID, primaryKey: true , allowNull: false, references: {model: 'Users', key: 'id'}},
  createdAt: {type: DataTypes.DATE, defaultValue: DataTypes.NOW} 
}, {
  timestamps: false,
});

Following.associate = function(models) {
  Following.belongsTo(models.User, { as: 'follower', foreignKey: 'followerId' });
  Following.belongsTo(models.User, { as: 'followed', foreignKey: 'followedId' });
};

module.exports = Following; 