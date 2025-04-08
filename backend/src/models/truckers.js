
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Trucker = sequelize.define('Trucker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  capacity: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Truck capacity or load capacity'
  },
  status: {
    type: DataTypes.ENUM('available', 'in_transit', 'unavailable'),
    allowNull: false,
    defaultValue: 'available'
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  currentCity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Comma-separated list of qualifications (e.g., "hazmat,refrigerated,oversize")'
  }
}, {
  timestamps: true
});

module.exports = Trucker;