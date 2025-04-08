const { sequelize } = require('../database');
const User = require('./users');

module.exports = {
  sequelize,
  User,
};