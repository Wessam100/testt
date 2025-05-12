const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('Iqraaly', 'postgres', 'password', {
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  logging: false,
});

sequelize.authenticate()
  .then(() => {
    console.log('PostgreSQL connected successfully!');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


module.exports = sequelize; 