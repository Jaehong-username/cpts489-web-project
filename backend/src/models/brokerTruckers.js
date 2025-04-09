
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const BrokerTrucker = sequelize.define('BrokerTrucker', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  brokerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Brokers',
      key: 'id'
    }
  },
  truckerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Truckers',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active'
  },
  startDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE
  }
}, {
  timestamps: true
});

module.exports = BrokerTrucker;