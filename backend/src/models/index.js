
const { sequelize } = require('../database');
const User = require('./users');
const Trucker = require('./truckers');
const Broker = require('./brokers');
const Review = require('./review');
const BrokerTrucker = require('./brokerTruckers');
const Feedback = require('./feedback');
const Message = require('./Message');

// User associations
User.hasOne(Trucker, { foreignKey: 'userId', as: 'truckerProfile' });
User.hasOne(Broker, { foreignKey: 'userId', as: 'brokerProfile' });

// Trucker associations
Trucker.belongsTo(User, { foreignKey: 'userId' });
Trucker.belongsToMany(Broker, { through: BrokerTrucker, foreignKey: 'truckerId', as: 'brokers' });

// Broker associations
Broker.belongsTo(User, { foreignKey: 'userId' });
Broker.belongsToMany(Trucker, { through: BrokerTrucker, foreignKey: 'brokerId', as: 'truckers' });

// Review associations
Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' }); // I am using alias
Review.belongsTo(User, { foreignKey: 'targetId', as: 'target' });





module.exports = {
  sequelize,
  User,
  Trucker,
  Broker,
  Review,
  BrokerTrucker,
  Feedback,
  Message
};