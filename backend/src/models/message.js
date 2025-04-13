
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

// defining the table
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  senderType: {
    type: DataTypes.ENUM('trucker', 'broker'),
    allowNull: false
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // This indicates a foreign key reference to the 'Users' table
      key: 'id'      // It references the 'id' field in the 'Users' table
    }
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  targetType: {
    type: DataTypes.ENUM('trucker', 'broker'),
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Message;